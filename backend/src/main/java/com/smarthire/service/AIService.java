package com.smarthire.service;

import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * AIService - Pure Java AI logic (no Python, no external ML library)
 *
 * Feature 1: Candidate-Job Match Score
 *   Uses Set intersection to calculate % of job skills candidate has
 *
 * Feature 2: Salary Prediction
 *   Rule-based formula: base + experience multiplier + skill count bonus
 */
@Service
public class AIService {

    // =====================================================
    // FEATURE 1: Match Score Calculation (0 - 100%)
    // =====================================================
    public int calculateMatchScore(User candidate, Job job) {
        List<String> candidateSkills = candidate.getSkillList();
        List<String> requiredSkills  = job.getRequiredSkillList();

        if (requiredSkills.isEmpty()) return 0;

        // Trim whitespace from both lists
        Set<String> candidateSet = new HashSet<>();
        for (String s : candidateSkills) candidateSet.add(s.trim());

        Set<String> requiredSet = new HashSet<>();
        for (String s : requiredSkills) requiredSet.add(s.trim());

        // Intersection count
        Set<String> matched = new HashSet<>(candidateSet);
        matched.retainAll(requiredSet);

        int score = (int) Math.round((matched.size() * 100.0) / requiredSet.size());

        // Bonus: +5 if experience meets minimum requirement
        if (candidate.getExperienceYears() != null
                && job.getMinExperience() != null
                && candidate.getExperienceYears() >= job.getMinExperience()) {
            score = Math.min(100, score + 5);
        }

        return score;
    }

    // =====================================================
    // FEATURE 2: Salary Prediction (in LPA)
    // =====================================================
    public String predictSalary(User candidate, Job job) {
        int experience = candidate.getExperienceYears() != null ? candidate.getExperienceYears() : 0;
        int skillCount = candidate.getSkillList().size();
        int matchScore = calculateMatchScore(candidate, job);

        // Base salary in LPA
        double baseSalary = 3.0;

        // Experience component: 1 LPA per year (capped at 15 years)
        double expBonus = Math.min(experience, 15) * 1.0;

        // Skill diversity bonus: 0.2 LPA per skill (capped at 10 skills)
        double skillBonus = Math.min(skillCount, 10) * 0.2;

        // Match quality bonus
        double matchBonus = 0;
        if (matchScore >= 80) matchBonus = 2.0;
        else if (matchScore >= 60) matchBonus = 1.0;
        else if (matchScore >= 40) matchBonus = 0.5;

        double predictedMin = baseSalary + expBonus + skillBonus;
        double predictedMax = predictedMin + matchBonus + 2.0; // 2 LPA range

        // Round to 1 decimal
        predictedMin = Math.round(predictedMin * 10.0) / 10.0;
        predictedMax = Math.round(predictedMax * 10.0) / 10.0;

        return predictedMin + " LPA – " + predictedMax + " LPA";
    }

    // =====================================================
    // Helper: Match Score Label
    // =====================================================
    public String getMatchLabel(int score) {
        if (score >= 80) return "Excellent Match";
        if (score >= 60) return "Good Match";
        if (score >= 40) return "Average Match";
        return "Low Match";
    }
}
