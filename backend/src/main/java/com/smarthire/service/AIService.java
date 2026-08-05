package com.smarthire.service;

import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class AIService {


    public int calculateMatchScore(User candidate, Job job) {
        List<String> candidateSkills = candidate.getSkillList();
        List<String> requiredSkills  = job.getRequiredSkillList();

        if (requiredSkills.isEmpty()) return 0;


        Set<String> candidateSet = new HashSet<>();
        for (String s : candidateSkills) candidateSet.add(s.trim());

        Set<String> requiredSet = new HashSet<>();
        for (String s : requiredSkills) requiredSet.add(s.trim());


        Set<String> matched = new HashSet<>(candidateSet);
        matched.retainAll(requiredSet);

        int score = (int) Math.round((matched.size() * 100.0) / requiredSet.size());


        if (candidate.getExperienceYears() != null
                && job.getMinExperience() != null
                && candidate.getExperienceYears() >= job.getMinExperience()) {
            score = Math.min(100, score + 5);
        }

        return score;
    }


    public String predictSalary(User candidate, Job job) {
        int experience = candidate.getExperienceYears() != null ? candidate.getExperienceYears() : 0;
        int skillCount = candidate.getSkillList().size();
        int matchScore = calculateMatchScore(candidate, job);


        double baseSalary = 3.0;


        double expBonus = Math.min(experience, 15) * 1.0;


        double skillBonus = Math.min(skillCount, 10) * 0.2;


        double matchBonus = 0;
        if (matchScore >= 80) matchBonus = 2.0;
        else if (matchScore >= 60) matchBonus = 1.0;
        else if (matchScore >= 40) matchBonus = 0.5;

        double predictedMin = baseSalary + expBonus + skillBonus;
        double predictedMax = predictedMin + matchBonus + 2.0; // 2 LPA range


        predictedMin = Math.round(predictedMin * 10.0) / 10.0;
        predictedMax = Math.round(predictedMax * 10.0) / 10.0;

        return predictedMin + " LPA – " + predictedMax + " LPA";
    }


    public String getMatchLabel(int score) {
        if (score >= 80) return "Excellent Match";
        if (score >= 60) return "Good Match";
        if (score >= 40) return "Average Match";
        return "Low Match";
    }
}
