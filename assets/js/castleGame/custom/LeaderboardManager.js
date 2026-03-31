/**
 * LeaderboardManager - Handles saving, loading, and managing game scores
 * Integrates with backend API (/api/events/SCORE_COUNTER) with localStorage fallback
 */

import { javaURI, fetchOptions } from '../../api/config.js';

class LeaderboardManager {
    constructor(gameId = 'archery') {
        this.gameId = gameId;
        this.gameName = `archery`; // For backend API
        this.storageKey = `leaderboard_${gameId}`;
        this.maxScores = 10; // Store/display top 10 scores
        this.hasBackend = Boolean(javaURI);
    }

    /**
     * Convert time (seconds) to score
     * Lower time = higher score
     * Perfect score: 5000 points (if completed in < 1 second)
     * Formula: score = 5000 - (time * 100), minimum 100 points
     */
    timeToScore(timeTaken) {
        if (timeTaken <= 0) return 5000;
        const score = Math.max(100, 5000 - Math.floor(timeTaken * 100));
        return score;
    }

    /**
     * Save a score to the leaderboard (backend first, fallback to localStorage)
     * @param {string} playerName - Player's name
     * @param {number} timeTaken - Time taken in seconds
     * @param {Object} metadata - Optional additional data
     * @returns {Promise<Object>} - Promise resolving to saved score object with rank
     */
    async saveScore(playerName, timeTaken, metadata = {}) {
        if (!playerName || playerName.trim() === '') {
            return Promise.reject(new Error('Player name is required'));
        }

        const score = this.timeToScore(timeTaken);
        const timestamp = new Date().toISOString();
        
        const scoreEntry = {
            playerName: playerName.trim(),
            score: score,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
            timestamp: timestamp,
            ...metadata
        };

        try {
            // Try to save to backend first
            if (this.hasBackend) {
                return await this.saveToBackend(scoreEntry);
            } else {
                // Fallback to localStorage
                return this.saveToLocalStorage(scoreEntry);
            }
        } catch (error) {
            console.warn('Backend save failed, falling back to localStorage:', error);
            // Fallback to localStorage on backend error
            return this.saveToLocalStorage(scoreEntry);
        }
    }

    /**
     * Save score to backend API
     */
    async saveToBackend(scoreEntry) {
        const endpoint = '/api/events/SCORE_COUNTER';
        const url = `${javaURI}${endpoint}`;

        const requestBody = {
            payload: {
                user: scoreEntry.playerName,
                score: scoreEntry.score,
                gameName: this.gameName,
                timeTaken: scoreEntry.timeTaken
            }
        };

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Score saved to backend:', result);

            // Also save to localStorage for offline access
            this.saveToLocalStorage(scoreEntry);

            // Fetch updated leaderboard to get rank
            const leaderboard = await this.getLeaderboardFromBackend();
            const rank = leaderboard.findIndex(entry => 
                entry.payload?.user === scoreEntry.playerName && 
                entry.payload?.score === scoreEntry.score
            ) + 1 || 1;

            return {
                ...scoreEntry,
                rank: rank,
                isNewHighScore: rank === 1,
                isTopTen: rank <= 10
            };
        } catch (error) {
            console.error('Failed to save score to backend:', error);
            throw error;
        }
    }

    /**
     * Save score to localStorage only
     */
    saveToLocalStorage(scoreEntry) {
        let scores = this.getLeaderboardFromStorage();
        scores.push(scoreEntry);

        // Sort by score (descending) and then by timestamp (ascending)
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

        // Keep only top scores
        scores = scores.slice(0, this.maxScores);

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
            console.log('Score saved to localStorage:', scoreEntry);
        } catch (e) {
            console.error('Failed to save score to localStorage:', e);
            return Promise.reject(e);
        }

        const rank = scores.findIndex(s => s.timestamp === scoreEntry.timestamp) + 1;
        return Promise.resolve({
            ...scoreEntry,
            rank: rank,
            isNewHighScore: rank === 1,
            isTopTen: rank <= 10
        });
    }

    /**
     * Get leaderboard from backend API
     */
    async getLeaderboardFromBackend() {
        if (!this.hasBackend) {
            return this.getLeaderboardFromStorage();
        }

        try {
            const endpoint = '/api/events/SCORE_COUNTER';
            const url = `${javaURI}${endpoint}`;

            const response = await fetch(url, {
                ...fetchOptions,
                method: 'GET'
            });

            if (!response.ok) {
                console.warn(`Failed to fetch leaderboard from backend: ${response.status}`);
                return this.getLeaderboardFromStorage();
            }

            const data = await response.json();
            const entries = Array.isArray(data) ? data : data.entries || [];

            // Filter by gameName and sort by score
            return entries
                .filter(entry => entry.payload?.gameName === this.gameName)
                .sort((a, b) => {
                    const scoreA = a.payload?.score || 0;
                    const scoreB = b.payload?.score || 0;
                    if (scoreB !== scoreA) return scoreB - scoreA;
                    return new Date(a.timestamp) - new Date(b.timestamp);
                })
                .slice(0, this.maxScores);
        } catch (error) {
            console.warn('Failed to fetch from backend, using localStorage:', error);
            return this.getLeaderboardFromStorage();
        }
    }

    /**
     * Get leaderboard from localStorage
     */
    getLeaderboardFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load leaderboard from localStorage:', e);
            return [];
        }
    }

    /**
     * Get the full leaderboard
     * @returns {Promise<Array>} - Promise resolving to array of score objects
     */
    async getLeaderboard() {
        return this.getLeaderboardFromBackend();
    }

    /**
     * Get a specific player's best score
     * @param {string} playerName - Player's name
     * @returns {Promise<Object|null>} - Promise resolving to best score object or null
     */
    async getPlayerBestScore(playerName) {
        const scores = await this.getLeaderboard();
        const playerScores = scores.filter(entry => 
            (entry.payload?.user || entry.playerName) === playerName
        );
        return playerScores.length > 0 ? playerScores[0] : null;
    }

    /**
     * Get player's rank on leaderboard
     * @param {string} playerName - Player's name
     * @returns {Promise<number>} - Promise resolving to rank (1-based), or -1 if not found
     */
    async getPlayerRank(playerName) {
        const scores = await this.getLeaderboard();
        const index = scores.findIndex(entry => 
            (entry.payload?.user || entry.playerName) === playerName
        );
        return index >= 0 ? index + 1 : -1;
    }

    /**
     * Clear all scores for this game
     */
    clearLeaderboard() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Local leaderboard cleared');
            // Note: Backend deletion would require additional API endpoint
        } catch (e) {
            console.error('Failed to clear leaderboard:', e);
        }
    }

    /**
     * Get leaderboard as formatted HTML table
     * @param {Array} scores - Scores to display (optional, fetches if not provided)
     * @returns {Promise<string>} - Promise resolving to HTML table of leaderboard
     */
    async getLeaderboardHTML(scores = null) {
        if (!scores) {
            scores = await this.getLeaderboard();
        }
        
        if (scores.length === 0) {
            return '<p style="color: #aaa; text-align: center;">No scores yet. Be the first!</p>';
        }

        let html = '<table style="width: 100%; border-collapse: collapse; color: #fff; font-family: \'Press Start 2P\', monospace; font-size: 0.65rem;">';
        html += '<thead style="border-bottom: 2px solid #fff;">';
        html += '<tr style="text-align: left;">';
        html += '<th style="padding: 8px; width: 15%;">Rank</th>';
        html += '<th style="padding: 8px; width: 40%;">Player</th>';
        html += '<th style="padding: 8px; width: 25%;">Score</th>';
        html += '<th style="padding: 8px; width: 20%;">Time</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        scores.forEach((entry, index) => {
            const playerName = entry.payload?.user || entry.playerName || 'Unknown';
            const score = entry.payload?.score || entry.score || 0;
            const timeTaken = entry.payload?.timeTaken || entry.timeTaken || 0;
            
            const bgColor = index % 2 === 0 ? 'rgba(0, 0, 0, 0.3)' : 'transparent';
            const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#fff';
            
            html += `<tr style="background-color: ${bgColor};">`;
            html += `<td style="padding: 8px; color: ${rankColor}; font-weight: bold;">#${index + 1}</td>`;
            html += `<td style="padding: 8px;">${this.escapeHtml(playerName)}</td>`;
            html += `<td style="padding: 8px;">${score.toLocaleString()}</td>`;
            html += `<td style="padding: 8px;">${timeTaken.toFixed(2)}s</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    /**
     * Escape HTML special characters for XSS protection
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

export default LeaderboardManager;
