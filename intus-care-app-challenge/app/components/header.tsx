const Header = () => {
    const headerStyles = {
        backgroundColor: "var(--grayscale-white)", 
        boxShadow: '0px 0.4px 0.4rem 0.06rem var(--grayscale-black50)'
    }

    return <>
        <div className="p-5" style={headerStyles}>
            <a href="/">
                <img src={'../images/logo_IntusCare.svg'} alt="Intus Care Logo" />
            </a>
        </div>
    </>
}

export default Header