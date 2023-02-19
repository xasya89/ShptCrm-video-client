import React from "react";
export const ActChooseContext = React.createContext();

export const actChooseinitialState = {
    actNum: null,
    actDate: null,
    actId: null
};

export const actChooseReducer = (state, action) => {
    switch(action.type) {
        case 'choose':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
};