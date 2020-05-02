import $ from 'jquery';
import Promise from 'promise';

class ServerDAO {

    getWaitingGame(pupilID) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/getWaitingGame.py',
                      {'pupilID': pupilID},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    submitGame(pupilID, gameID, wordList) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/submitGame.py',
                      {'pupilID': pupilID,
                       'gameID': gameID,
                       'wordList': wordList},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    markAsWaiting(pupilID) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/markAsWaiting.py',
                      {'pupilID': pupilID},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    haveAllPlayersSubmitted(gameID) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/allPlayersSubmitted.py',
                      {'gameID': gameID},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    scoreGame(pupilID, gameID) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/scoreGame.py',
                      {'pupilID': pupilID,
                       'gameID': gameID},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    getScoreboard(gameID) {
        return new Promise((resolve, reject) => {
            $.getJSON('cgi-bin/scoreboard.py',
                      {'gameID': gameID},
                      (data) => {
                          resolve(data);
                      });
        });
    }

    stillHere(pupilID) {
        $.post('cgi-bin/stillHere.py',
               {'pupilID': pupilID});
    }
};

export default new ServerDAO();
