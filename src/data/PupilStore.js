import $ from 'jquery';
import Immutable from 'immutable';
import Promise from 'promise';
import {ReduceStore} from 'flux/utils';
import PupilActionTypes from './PupilActionTypes';
import PupilDispatcher from './PupilDispatcher';

class PupilStore extends ReduceStore {
    constructor() {
	super(PupilDispatcher);
    }

    getInitialState() {
	return {
            listItems: Immutable.List(),
            textBox: '',
            time: 0,
        };
    }

    askForGame(pupilID) {
        return new Promise((resolve, reject) => {
            $.get("cgi-bin/askForGame.py",
                  {"pupilID": pupilID,
                   "date": new Date().getTime(),
                  },
                  function(data) {
                      console.log("asked");
                      success = data.split(":");
                      if (success[0]=="Found") {
                          console.log('yee');
                          resolve(success[1]);
                      } else {
                          console.log('nein');
                          resolve(undefined);
                      }
                  });
        });
    }

    reduce(state, action) {
	switch (action.type) {
	case PupilActionTypes.CLICK:
	    return {
                listItems: state.listItems.push({val: state.textBox,
                                                 key: state.listItems.size}),
                textBox: '',
                time: state.time,
            };

        case PupilActionTypes.TEXT_CHANGE:
            return {
                listItems: state.listItems,
                textBox: action.text,
                time: state.time,
            };

        case PupilActionTypes.TICK:
            if (state.textBox && state.time % 3 == 0) {
                this.askForGame(state.textBox).then((t) => {
                    console.log("done");
                });
            }
            return {
                listItems: state.listItems,
                textBox: state.textBox,
                time: state.time + 1,
            };

	default:
	    return state;
	}
    }

}

export default new PupilStore();
