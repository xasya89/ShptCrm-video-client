import { Children, cloneElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeftButton, ArrowRightButton } from './ArrowButtons';
import styles from './slider.module.scss'

export default function VideoSlider ({children}) {
    const [pages, setPages] = useState([]);
    const [positionStart, setPositionStart] = useState(0);
    const [positionTranslate, setPositionTranslate] = useState(0);
    const clientX = useRef(0);
    const downFlag = useRef(false);
    const containerRef = useRef();
    const countAction = useRef(0);
    const handleArrowLeftClick = () => {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        if(countAction.current === 0)
            return;
        const pos = positionTranslate + containerWidth ;
        containerRef.current.style.transform = `translateX(${pos}px)`;
        countAction.current -= 1;
        setPositionTranslate(pos);
    }
    const handleArrowRightlick = () => {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        if(countAction.current === pages.length - 1)
            return;
        const pos = positionTranslate - containerWidth ;
        containerRef.current.style.transform = `translateX(${pos}px)`;
        countAction.current += 1;
        setPositionTranslate(pos);
    }
    useEffect(() => {
        setPages(
            Children.map(children, child => {
                return cloneElement(child, {
                    style: {
                        height: "100%",
                        minWidth: "100%",
                        maxWidth: "100%"
                    },
                })
            })
        )
    }, [children]);

    const getClientX = e => e.clientX!==undefined ? e.clientX : e.touches[0].clientX;

    const mouseDown = e => {
        downFlag.current=true;
        setPositionStart(getClientX(e));
    }

    const mouseMouve = e => {
        if(!downFlag.current)
            return;
        clientX.current = getClientX(e);
        containerRef.current.style.transform = `translateX(${positionTranslate + getClientX(e) - positionStart}px)`;
    }

    const mouseUp = e => {
        downFlag.current=false;
        
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        let diffFlag = Math.abs(clientX.current - positionStart)>containerWidth * 0.3;
        if(positionStart < clientX.current & countAction.current === 0)
            diffFlag = false;
        if(positionStart > clientX.current & countAction.current === pages.length - 1)
            diffFlag = false;
        const pos = diffFlag ? positionTranslate + ( clientX.current - positionStart < 0 ? -1 * containerWidth : containerWidth ) : positionTranslate;
        containerRef.current.style.transform = `translateX(${pos}px)`;
        if(diffFlag)
            countAction.current = positionStart > clientX.current ? countAction.current + 1 : countAction.current - 1;
        setPositionTranslate(pos);
        //setPositionTranslate(prev => prev + e.clientX - positionStart);
    }
    return (
        <div className={styles.main}>
            <ArrowLeftButton onClick={handleArrowLeftClick} />
            <div className={styles.window}>
                <div ref={containerRef} onMouseDown={mouseDown} onMouseMove={mouseMouve} onMouseUp={mouseUp} onTouchStart={mouseDown} onTouchMove={mouseMouve} onTouchEnd={mouseUp} className={styles.allPagesContainer} style={{transform: "translateX(0)"}}>
                    {pages}
                </div>
            </div>
            <ArrowRightButton onClick={handleArrowRightlick} />
        </div>
    )
}