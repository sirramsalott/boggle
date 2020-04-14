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

    submitGame(game) {
        return undefined;
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
