import React, { useState, useMemo } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Box, Chip, Divider, LinearProgress
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useDecision } from '../../context/DecisionContext';

const InsightPanel = () => {
    const [open, setOpen] = useState(false);
    const { state } = useDecision();

    const analysis = useMemo(() => {
        const { factors } = state;
        if (!factors.length) return null;

        let yesScore = 0;
        let noScore = 0;
        let emotionalCount = 0;
        let logicalCount = 0;
        let uncertaintyCount = 0;

        factors.forEach(f => {
            // Weight * 100 for easier reading
            const strength = f.weight * 100;

            if (f.type.includes('PRO')) yesScore += strength;
            if (f.type.includes('CON')) noScore += strength;

            if (f.type.includes('EMOTION')) emotionalCount++;
            else if (f.type === 'UNCERTAINTY') uncertaintyCount++;
            else logicalCount++;
        });

        const totalScore = yesScore - noScore; // Positive = YES, Negative = NO
        const dominant = Math.abs(totalScore) < 50 ? 'UNCERTAIN / OSCILLATING' : totalScore > 0 ? 'YES' : 'NO';

        // Sort drivers
        const topDrivers = [...factors].sort((a, b) => b.weight - a.weight).slice(0, 3);

        const ratio = emotionalCount + logicalCount === 0 ? 0 : (emotionalCount / (emotionalCount + logicalCount)) * 100;
        const style = ratio > 60 ? 'Emotion-Heavy' : ratio < 30 ? 'Logic-Driven' : 'Balanced';

        return {
            yesScore,
            noScore,
            totalScore,
            dominant,
            topDrivers,
            style,
            uncertaintyCount
        };
    }, [state.factors]);

    return (
        <>
            <Button
                variant="contained"
                startIcon={<PsychologyIcon />}
                onClick={() => setOpen(true)}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 100,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': { background: 'rgba(255,255,255,0.2)' }
                }}
            >
                Analyze Decision
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        background: '#16213e',
                        color: '#fff',
                        minWidth: '400px',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Decision Insight</DialogTitle>
                <DialogContent>
                    {!analysis ? (
                        <Typography>Add some factors to see the storm pattern.</Typography>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            <Box display="flex" justifyContent="center" mb={3}>
                                <Chip
                                    label={`RESULT: ${analysis.dominant}`}
                                    color={analysis.dominant === 'YES' ? 'primary' : analysis.dominant === 'NO' ? 'secondary' : 'default'}
                                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 2, py: 3 }}
                                />
                            </Box>

                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="caption" color="primary">YES Pull: {Math.round(analysis.yesScore)}</Typography>
                                <Typography variant="caption" color="secondary">NO Pull: {Math.round(analysis.noScore)}</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(analysis.yesScore / (analysis.yesScore + analysis.noScore || 1)) * 100}
                                sx={{ height: 10, borderRadius: 5, mb: 3 }}
                            />

                            <Typography variant="h6" gutterBottom>Thinking Style: <Box component="span" sx={{ color: '#f1c40f' }}>{analysis.style}</Box></Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                                {analysis.uncertaintyCount > 0 && `⚠️ Destabilized by ${analysis.uncertaintyCount} uncertainty factors.`}
                            </Typography>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                            <Typography variant="subtitle2" gutterBottom>Top Drivers:</Typography>
                            {analysis.topDrivers.map(f => (
                                <Box key={f.id} display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>{f.title}</Typography>
                                    <Typography sx={{ opacity: 0.6 }}>{Math.round(f.weight * 100)}%</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#fff' }}>Close Analysis</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InsightPanel;
