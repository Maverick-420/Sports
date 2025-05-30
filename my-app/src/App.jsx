import React, { useState, useEffect } from "react";
import { Calendar, Clock, Trophy, RefreshCw } from "lucide-react";

const UpcomingMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch("http://localhost:3000/api/matches");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMatches(data.matches);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCompetitionColor = (competition) => {
    const colors = {
      "Premier League": "bg-purple-100 text-purple-800",
      "La Liga": "bg-orange-100 text-orange-800",
      Bundesliga: "bg-red-100 text-red-800",
      "Serie A": "bg-green-100 text-green-800",
      "Ligue 1": "bg-blue-100 text-blue-800",
    };
    return colors[competition] || "bg-gray-100 text-gray-800";
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading upcoming matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchMatches}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Upcoming Soccer Matches
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated with the latest fixtures
                </p>
              </div>
            </div>
            <button
              onClick={fetchMatches}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Matches List */}
      <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-4 pb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCompetitionColor(
                    match.competition.name
                  )}`}
                >
                  {match.competition.name}
                </span>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="text-3xl mb-2">{match.homeTeam.logo}</div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {match.homeTeam.name}
                    </p>
                  </div>
                  <div className="mx-4 text-center">
                    <div className="text-2xl font-bold text-gray-400">VS</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-3xl mb-2">{match.awayTeam.logo}</div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {match.awayTeam.name}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>{formatDate(match.utcDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>{formatTime(match.utcDate)} UTC</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No upcoming matches found</p>
          </div>
        )}
      </div>

      {/* API Info Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            API Information
          </h3>
          <p className="text-blue-800 text-sm mb-2">
            This demo uses mock data. In a production environment, you would
            fetch real data from:
          </p>
          <code className="bg-blue-100 text-blue-900 px-3 py-1 rounded text-sm">
            https://api.football-data.org/v4/matches
          </code>
          <p className="text-blue-700 text-xs mt-2">
            You'll need to register for a free API key at football-data.org
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatches;
