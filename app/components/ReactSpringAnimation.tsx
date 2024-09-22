import React from 'react';
import { useSpring, animated } from 'react-spring';

const ReactSpringAnimation: React.FC = () => {
    const styles = useSpring({
        from: { transform: 'translateX(0px)' },
        to: { transform: 'translateX(300px)' },
        config: { tension: 200, friction: 10 },
        loop: { reverse: true }
    });

    return <animated.div style={styles} className="spring-box">Token</animated.div>;
};

export default ReactSpringAnimation;