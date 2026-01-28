import React, { useRef, useEffect } from 'react';
import { useDecision } from '../../context/DecisionContext';
import { useDecisionPhysics } from '../../hooks/useDecisionPhysics';
import StormBackground from './StormBackground';
import FactorNode from '../FactorNode/FactorNode';
import { Box, Typography } from '@mui/material';

const DecisionArena = () => {
    const { state, dispatch } = useDecision();
    const arenaRef = useRef(null);

    // Initialize Physics Engine
    useDecisionPhysics(state.factors, dispatch);

    const handleUpdateFactor = (updatedFactor) => {
        dispatch({ type: 'UPDATE_FACTOR', payload: updatedFactor });
    };

    const handleDragStart = (id) => {
        dispatch({ type: 'SET_DRAGGING', payload: { id, isDragging: true } });
    };

    const handleDragEnd = (updatedFactor) => {
        dispatch({ type: 'SET_DRAGGING', payload: { id: updatedFactor.id, isDragging: false } });
        dispatch({ type: 'UPDATE_FACTOR', payload: updatedFactor });
    };

    return (
        <Box
            ref={arenaRef}
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <StormBackground />
            {/* Background Zones */}
            <Box sx={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0, width: '50%',
                background: 'linear-gradient(90deg, rgba(46, 204, 113, 0.1) 0%, transparent 100%)',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: 5
            }}>
                <Typography variant="h1" sx={{ opacity: 0.1, fontWeight: 900, color: '#2ecc71' }}>YES</Typography>
            </Box>
            <Box sx={{
                position: 'absolute',
                right: 0, top: 0, bottom: 0, width: '50%',
                background: 'linear-gradient(-90deg, rgba(231, 76, 60, 0.1) 0%, transparent 100%)',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 5
            }}>
                <Typography variant="h1" sx={{ opacity: 0.1, fontWeight: 900, color: '#e74c3c' }}>NO</Typography>
            </Box>

            {/* Factors */}
            {state.factors.map(factor => (
                <FactorNode
                    key={factor.id}
                    factor={factor}
                    onUpdate={handleUpdateFactor}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </Box>
    );
};

export default DecisionArena;
