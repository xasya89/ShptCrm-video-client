import styles from './slider.module.scss'

export  function ArrowLeftButton({onClick}) {
    return (
        <div onClick={onClick} className={styles.arrowButton} style={{left: "0px", top: "-10"}}>
            <svg  viewBox="0 0 1024 1024" class="icon"  version="1.1" >
                <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000" />
            </svg>
        </div>
    )
}

export function ArrowRightButton({onClick}) {
    return (
        <div onClick={onClick} className={styles.arrowButton} style={{right: "0px"}}>
            <svg  viewBox="0 0 1024 1024" class="icon"  version="1.1" >
                <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000" />
            </svg>
        </div>
    )
}