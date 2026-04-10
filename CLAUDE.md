@AGENTS.md

# Styling

Never use inline styles (`style={{...}}`) or JS style objects (`const x: React.CSSProperties = {...}`). Always use SCSS modules — create a `.module.scss` file and apply styles via `className={styles.foo}`.
