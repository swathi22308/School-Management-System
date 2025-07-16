import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Star, X } from 'lucide-react';
import './MissingSkills.css';


const MissingSkills = ({ isVisible, onClose }) => {
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch job role data
  const fetchJobRoleData = useCallback(async (jobRole) => {
    if (!jobRole) return null;
    
    try {
      const response = await fetch(`http://localhost:5000/api/jobRoles/${encodeURIComponent(jobRole)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job role data: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching job role data:', err);
      throw err;
    }
  }, []);

  // Function to calculate missing skills
  const calculateMissingSkills = useCallback((userSkills, jobData) => {
    if (!jobData || !userSkills) return [];

    const requiredSkills = jobData.requiredSkills || jobData.skills || [];
    
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return [];
    }

    const userSkillsLower = userSkills.map(skill => 
      typeof skill === 'string' ? skill.toLowerCase() : skill.name?.toLowerCase() || ''
    ).filter(skill => skill !== '');
    
    let missingSkills = [];

    requiredSkills.forEach(skill => {
      const skillName = skill.skillName || skill.name || skill;
      const weightage = skill.weightage || skill.weight || 1;
      const level = skill.level || 'Intermediate';
      const category = skill.category || 'General';
      
      const isMatched = userSkillsLower.some(userSkill => 
        userSkill.includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(userSkill)
      );
      
      if (!isMatched) {
        missingSkills.push({
          skillName,
          weightage,
          level,
          category,
          learningResources: skill.learningResources || skill.resources
        });
      }
    });

    // Sort by weightage (descending) to show most important skills first
    return missingSkills.sort((a, b) => b.weightage - a.weightage);
  }, []);

  const loadMissingSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get data from storage
      let storage = null;
      const sessionData = sessionStorage.getItem('devRouteStorage');
      if (sessionData) {
        storage = JSON.parse(sessionData);
      } else {
        storage = window.devRouteStorage;
      }

      if (!storage) {
        setMissingSkills([]);
        setJobRole('');
        setLoading(false);
        return;
      }

      const selectedJobRole = storage.selectedJobRole || '';
      const extractedSkills = storage.extractedSkills || [];
      const manualSkills = storage.manualSkills || [];
      const allSkills = [...extractedSkills, ...manualSkills];

      setJobRole(selectedJobRole);

      if (!selectedJobRole || allSkills.length === 0) {
        setMissingSkills([]);
        setLoading(false);
        return;
      }

      // Fetch job role data and calculate missing skills
      const jobData = await fetchJobRoleData(selectedJobRole);
      
      if (jobData) {
        const missing = calculateMissingSkills(allSkills, jobData);
        setMissingSkills(missing);
      } else {
        setMissingSkills([]);
      }
      
    } catch (error) {
      console.error('Error loading missing skills:', error);
      setError('Failed to load missing skills');
      setMissingSkills([]);
    } finally {
      setLoading(false);
    }
  }, [fetchJobRoleData, calculateMissingSkills]);

  useEffect(() => {
    if (isVisible) {
      loadMissingSkills();
    }
  }, [isVisible, loadMissingSkills]);

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'level-beginner';
      case 'Intermediate': return 'level-intermediate';
      case 'Advanced': return 'level-advanced';
      default: return 'level-default';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="missing-skills-backdrop" onClick={onClose} />
      
      {/* Main popup */}
      <div className="missing-skills-popup">
        <div className="popup-header">
          <div className="popup-title">
            <AlertCircle size={20} className="icon-orange" />
            <h3>Skills You Need to Learn</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="popup-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner-small"></div>
              <p>Analyzing your skill gaps...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={16} className="icon-red" />
              <p>{error}</p>
            </div>
          ) : (
            <>
              {jobRole && (
                <div className="job-role-info">
                  <span>Skills needed for: <strong>{jobRole}</strong></span>
                </div>
              )}
              
              {missingSkills.length > 0 ? (
                <div className="skills-list">
                  {missingSkills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.skillName}</span>
                        <span className={`skill-level ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="skill-meta">
                        <span className="skill-category">{skill.category}</span>
                        <div className="skill-weightage">
                          <Star size={12} className="icon-yellow" />
                          <span>{skill.weightage}% importance</span>
                        </div>
                      </div>
                      
                      {skill.learningResources && (
                        <div className="learning-resources">
                          <div className="resource-links">
                            {skill.learningResources.video && (
                              <a href={skill.learningResources.video} target="_blank" rel="noopener noreferrer" className="resource-link video">
                                📹 Video
                              </a>
                            )}
                            {skill.learningResources.docs && (
                              <a href={skill.learningResources.docs} target="_blank" rel="noopener noreferrer" className="resource-link docs">
                                📖 Docs
                              </a>
                            )}
                            {skill.learningResources.course && (
                              <a href={skill.learningResources.course} target="_blank" rel="noopener noreferrer" className="resource-link course">
                                🎓 Course
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">🎉</div>
                  <h4>Congratulations!</h4>
                  <p>You have all the required skills for this role.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MissingSkills;