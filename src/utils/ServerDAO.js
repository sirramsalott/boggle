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

};

export default new ServerDAO();
