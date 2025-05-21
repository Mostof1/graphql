import React, { useEffect, useState } from 'react';
import { formatBytes } from '../utils/formatBytes';
import {
  executeQuery,
  getUserQuery,
  getUserXpQuery,
  getUserProgressQuery,
  getProjectResultsQuery
} from '../services/graphql.service';
import XpOverTimeGraph from './graphs/XpOverTime';
import ProjectsRatioGraph from './graphs/ProjectsRatio';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xpData, setXpData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [totalXp, setTotalXp] = useState(0);
  const [stats, setStats] = useState({
    totalProjects: 0,
    passedProjects: 0,
    failedProjects: 0,
    xpByProject: {},
    skillLevels: {}
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user basic info
      const userData = await executeQuery(getUserQuery);
      setUser(userData.user[0]);

      // Update username in the App component
      if (userData.user[0] && userData.user[0].login) {
        // Use local storage to pass the username to the App component
        localStorage.setItem('username', userData.user[0].login);
        // This is a simple way to notify the App component that username has been updated
        window.dispatchEvent(new Event('usernameUpdated'));
      }

      // Fetch XP transactions
      const xpResponse = await executeQuery(getUserXpQuery);
      setXpData(xpResponse.transaction);

      // Calculate total XP
      const total = xpResponse.transaction.reduce((sum, tx) => sum + tx.amount, 0);
      setTotalXp(total);

      // Fetch projects progress
      const progressResponse = await executeQuery(getUserProgressQuery);

      // Fetch project results
      const resultsResponse = await executeQuery(getProjectResultsQuery);

      // Process projects data
      const projectsProgress = progressResponse.progress.filter(
        p => p.object && p.object.type === 'project'
      );
      setProjectsData(projectsProgress);

      // Calculate statistics
      calculateStats(xpResponse.transaction, projectsProgress, resultsResponse.result);

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data');
      setLoading(false);
    }
  };

  const calculateStats = (xpTransactions, projects, results) => {
    // Project stats
    const projectStats = projects.reduce((stats, project) => {
      stats.totalProjects++;
      if (project.grade > 0) {
        stats.passedProjects++;
      } else {
        stats.failedProjects++;
      }
      return stats;
    }, { totalProjects: 0, passedProjects: 0, failedProjects: 0 });

    // XP by project path
    const xpByPath = xpTransactions.reduce((acc, tx) => {
      const pathParts = tx.path.split('/');
      const projectKey = pathParts.length >= 3 ? `${pathParts[1]}/${pathParts[2]}` : tx.path;

      if (!acc[projectKey]) {
        acc[projectKey] = 0;
      }
      acc[projectKey] += tx.amount;
      return acc;
    }, {});

    // Extract skills from paths
    const skillLevels = {};
    xpTransactions.forEach(tx => {
      const pathParts = tx.path.split('/');
      if (pathParts.length >= 3) {
        const skill = pathParts[2]; // Assumes skill is in the third position of path
        if (!skillLevels[skill]) {
          skillLevels[skill] = { xp: 0, count: 0 };
        }
        skillLevels[skill].xp += tx.amount;
        skillLevels[skill].count++;
      }
    });

    setStats({
      ...projectStats,
      xpByProject: xpByPath,
      skillLevels
    });
  };

  // Get top skills by XP
  const getTopSkills = (limit = 5) => {
    return Object.entries(stats.skillLevels)
      .sort((a, b) => b[1].xp - a[1].xp)
      .slice(0, limit)
      .map(([skill, data]) => ({
        name: skill,
        xp: data.xp,
        level: calculateSkillLevel(data.xp)
      }));
  };

  // Calculate skill level based on XP
  const calculateSkillLevel = (xp) => {
    if (xp >= 10000) return 'Expert';
    if (xp >= 5000) return 'Advanced';
    if (xp >= 2000) return 'Intermediate';
    if (xp >= 500) return 'Beginner';
    return 'Novice';
  };

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!user) {
    return <div className="error-message">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {/* Display first letter of username as avatar */}
          <div className="avatar-letter">{user.login.charAt(0).toUpperCase()}</div>
        </div>

        <div className="profile-info">
          <h2>{user.login}</h2>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Total XP</span>
              <span className="stat-value">{formatBytes(totalXp)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Projects</span>
              <span className="stat-value">{stats.totalProjects}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">
                {stats.totalProjects > 0
                  ? `${Math.round((stats.passedProjects / stats.totalProjects) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Top Skills</h3>
          <div className="skills-container">
            {getTopSkills().map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
                <div className="skill-progress-container">
                  <div
                    className="skill-progress-bar"
                    style={{ width: `${Math.min(100, (skill.xp / 10000) * 100)}%` }}
                  ></div>
                </div>
                <div className="skill-xp">{formatBytes(skill.xp)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>XP Distribution</h3>
          <div className="xp-distribution">
            <table className="xp-table">
              <thead>
                <tr>
                  <th>Project/Path</th>
                  <th>XP</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.xpByProject)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([path, xp], index) => (
                    <tr key={index}>
                      <td>{path}</td>
                      <td>{formatBytes(xp)}</td>
                      <td>{((xp / totalXp) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="profile-section graphs-section">
          <h3>Statistics</h3>
          <div className="graphs-container">
            <XpOverTimeGraph xpData={xpData} />
            <ProjectsRatioGraph projectsData={projectsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;