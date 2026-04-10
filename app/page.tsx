import {DogEar} from '@/components/DogEar/DogEar'
import styles from './page.module.scss'

export default function Home() {
    return (
        <div className={styles.page}>
            <DogEar corner="bottom-right">
                <div className={styles.card}>Projekty</div>
            </DogEar>
            <DogEar corner="bottom-left">
                <div className={styles.card}>Výstavy</div>
            </DogEar>
            <DogEar corner="top-right">
                <div className={styles.card}>Udalosti</div>
            </DogEar>
            <DogEar corner="top-left">
                <div className={styles.card}>Kontakt</div>
            </DogEar>
            <DogEar corner="bottom-right" size={60}>
                <div className={styles.cardLarge}>Vlastní velikosť</div>
            </DogEar>
        </div>
    )
}
