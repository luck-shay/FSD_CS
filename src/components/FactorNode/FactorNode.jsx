import React from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Slider, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(motion.div)(({ theme, factortype }) => ({
    position: 'absolute',
    width: 200,
    padding: theme.spacing(2),
    borderRadius: 16,
    cursor: 'grab',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    color: '#fff',
    zIndex: 10,
    borderLeft: `4px solid ${factortype === 'PRO' ? theme.palette.primary.main :
        factortype === 'CON' ? theme.palette.secondary.main :
            factortype === 'EMOTION_PRO' ? '#f1c40f' :
                factortype === 'EMOTION_CON' ? '#e67e22' :
                    '#9b59b6' // Uncertainty
        }`,
    '&:active': {
        cursor: 'grabbing',
    }
}));

const FactorNode = ({ factor, onUpdate, onDragStart, onDragEnd }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(factor.title);

    const handleChange = (e, newValue) => {
        onUpdate({ ...factor, weight: newValue });
    };

    const handleTitleSave = () => {
        setIsEditing(false);
        if (editTitle.trim() && editTitle !== factor.title) {
            onUpdate({ ...factor, title: editTitle });
        } else {
            setEditTitle(factor.title); // Revert if empty
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        }
    };

    return (
        <StyledCard
            layout // Handover layout animations to Framer Motion
            drag
            dragMomentum={false}
            initial={{ x: factor.x, y: factor.y, scale: 0 }}
            animate={{ x: factor.x, y: factor.y, scale: 1 }}
            transition={{ x: { duration: 0 }, y: { duration: 0 } }} // Instant update for physics
            factortype={factor.type}
            whileHover={{ scale: 1.05, zIndex: 100 }}
            onDragStart={() => onDragStart(factor.id)}
            onDragEnd={(e, info) => {
                onDragEnd({ ...factor, x: factor.x + info.offset.x, y: factor.y + info.offset.y });
            }}
            onDoubleClick={(e) => {
                e.stopPropagation(); // Prevent anything else from catching it
                setIsEditing(true);
            }}
        >
            {isEditing ? (
                <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    size="small"
                    variant="standard"
                    fullWidth
                    InputProps={{
                        disableUnderline: true,
                        style: { color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }
                    }}
                    sx={{ mb: 1 }}
                />
            ) : (
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ cursor: 'text' }}>
                    {factor.title}
                </Typography>
            )}

            <Typography variant="caption" display="block" sx={{ opacity: 0.7, mb: 1 }}>
                {factor.type.replace('_', ' ')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                    size="small"
                    value={factor.weight}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChange}
                    sx={{
                        color: 'inherit',
                        '& .MuiSlider-thumb': { width: 12, height: 12 }
                    }}
                />
            </Box>
        </StyledCard>
    );
};

export default FactorNode;
