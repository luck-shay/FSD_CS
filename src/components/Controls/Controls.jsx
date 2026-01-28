import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, Stack, IconButton, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDecision } from '../../context/DecisionContext';

const Controls = () => {
    const { dispatch } = useDecision();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('PRO');

    const handleAdd = () => {
        if (!title.trim()) return;

        // Random initial position near center but slightly offset
        const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
        const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;

        dispatch({
            type: 'ADD_FACTOR',
            payload: {
                id: crypto.randomUUID(),
                title,
                type,
                weight: 0.5,
                x: startX,
                y: startY,
                vx: 0,
                vy: 0
            }
        });
        setTitle('');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => setIsOpen(true)}
            >
                <AddIcon />
            </Fab>
        );
    }

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 320,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 24,
            zIndex: 1000
        }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box component="h3" m={0} color="text.primary">Add Factor</Box>
                <IconButton size="small" onClick={() => setIsOpen(false)}><CloseIcon /></IconButton>
            </Box>

            <Stack spacing={2}>
                <TextField
                    label="Factor Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />

                <Select
                    value={type}
                    size="small"
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="PRO">Logical Pro (Pull to YES)</MenuItem>
                    <MenuItem value="CON">Logical Con (Pull to NO)</MenuItem>
                    <MenuItem value="EMOTION_PRO">Emotional Pro</MenuItem>
                    <MenuItem value="EMOTION_CON">Emotional Con</MenuItem>
                    <MenuItem value="UNCERTAINTY">Uncertainty</MenuItem>
                </Select>

                <Button variant="contained" fullWidth onClick={handleAdd}>
                    Add to Storm
                </Button>
            </Stack>
        </Box>
    );
};

export default Controls;
