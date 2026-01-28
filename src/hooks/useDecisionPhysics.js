import { useEffect, useRef } from 'react';

export const useDecisionPhysics = (factors, dispatch) => {
    const requestRef = useRef();

    // We use a ref to track physics state to avoid closure staleness without dependency cycles
    const factorsRef = useRef(factors);
    useEffect(() => { factorsRef.current = factors; }, [factors]);

    const updatePhysics = () => {
        // If no factors, just loop
        if (factorsRef.current.length === 0) {
            requestRef.current = requestAnimationFrame(updatePhysics);
            return;
        }

        const updatedFactors = factorsRef.current.map(factor => {
            if (factor.isDragging) return factor; // Skip physics for dragging node

            let { x, y, vx, vy, type, weight } = factor;

            // Constants
            const CENTER_X = window.innerWidth / 2;
            const CENTER_Y = window.innerHeight / 2;
            const DAMPING = 0.98;
            const ATTRACTION_STRENGTH = 0.5 * weight;
            const MAX_VELOCITY = 5; // Terminal velocity clamp

            // 1. Apply Forces based on Type
            if (type === 'PRO' || type === 'EMOTION_PRO') {
                // Pull left (YES)
                vx -= ATTRACTION_STRENGTH;
            } else if (type === 'CON' || type === 'EMOTION_CON') {
                // Pull right (NO)
                vx += ATTRACTION_STRENGTH;
            }

            // 2. Center Gravity (keep them in bounds/arena)
            // Weak pull to center of Y axis
            vy += (CENTER_Y - y) * 0.005;
            // Weak pull to center of X (to resist the extreme poles)
            vx += (CENTER_X - x) * 0.002;

            // 3. Special Behaviors
            if (type === 'UNCERTAINTY') {
                // Drastically reduced random wobble
                vx += (Math.random() - 0.5) * 0.2;
                vy += (Math.random() - 0.5) * 0.2;
            }

            if (type.includes('EMOTION')) {
                // Reduced emotion jitter
                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;
            }

            // 4. Update Position
            vx *= DAMPING;
            vy *= DAMPING;

            // Clamp velocity
            vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, vx));
            vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, vy));

            x += vx;
            y += vy;

            // Boundary checks (bounce)
            if (x < 0 || x > window.innerWidth - 200) vx *= -1;
            if (y < 0 || y > window.innerHeight - 100) vy *= -1;

            return { ...factor, x, y, vx, vy };
        });

        // Optimization: Only dispatch if significant movement or periodically?
        // For now, we dispatch. NOTE: This will trigger re-renders 60fps.
        // In a real app, we might use a mutable ref for positions and only sync state on drop.
        // BUT, since we need "Motion = Meaning" visual feedback, reacting to state is easiest.
        // To avoid React overload, maybe we only dispatch if positions changed significantly?
        // Let's rely on React 18 batching for now.

        // ACTUALLY, dispatching on every frame is bad practice.
        // Better: FactorNode usually uses local animation frame if disconnected.
        // But we need them to interact.

        // Let's try a different approach:
        // Update the REF, and force update or let components read from ref?
        // Re-dispatching "UPDATE_ALL_POSITIONS" might be too heavy.

        // Let's implement a "Tick" that runs every 50ms instead of 16ms (20fps) for logic updates,
        // and rely on CSS transitions for smoothness?
        // No, "storm" needs fluid physics.

        // Let's just return the function and let the Hook consumer decide when to call it?
        // No, the hook should run it.

        // COMPROMISE: We will dispatch "PHYSICS_TICK" which updates all factors.
        dispatch({ type: 'PHYSICS_TICK', payload: updatedFactors });

        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Only start once. The ref handles current factors.
};
