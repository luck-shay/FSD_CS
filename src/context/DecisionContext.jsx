import { createContext, useContext, useReducer } from 'react';

const DecisionContext = createContext();

const initialState = {
    title: '',
    factors: [], // { id, title, type: 'PRO'|'CON'|'EMOTION_PRO'|'EMOTION_CON'|'UNCERTAINTY', weight: 0-1, x, y, vx, vy }
    status: 'CALM', // CALM, CONFLICTED, OVERLOADED
};

function decisionReducer(state, action) {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.payload };
        case 'ADD_FACTOR':
            return { ...state, factors: [...state.factors, action.payload] };
        case 'UPDATE_FACTOR':
            return {
                ...state,
                factors: state.factors.map(f => f.id === action.payload.id ? { ...f, ...action.payload } : f)
            };
        case 'REMOVE_FACTOR':
            return { ...state, factors: state.factors.filter(f => f.id !== action.payload) };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'PHYSICS_TICK':
            // Replace entire factors array with new positions
            return { ...state, factors: action.payload };
        case 'SET_DRAGGING':
            return {
                ...state,
                factors: state.factors.map(f => f.id === action.payload.id ? { ...f, isDragging: action.payload.isDragging } : f)
            };
        default:
            return state;
    }
}

export function DecisionProvider({ children }) {
    const [state, dispatch] = useReducer(decisionReducer, initialState);
    return (
        <DecisionContext.Provider value={{ state, dispatch }}>
            {children}
        </DecisionContext.Provider>
    );
}

export const useDecision = () => useContext(DecisionContext);
