import Image from 'next/image'
import '../app.css'

const Header = () => {
    const headerStyles = {
        backgroundColor: "var(--grayscale-white)", 
        boxShadow: '0px 0.4px 0.4rem 0.06rem var(--grayscale-black50)'
    }

    return <>
        <div className="p-5" style={headerStyles}>
            <Image 
                src={'/logo_IntusCare.png'} 
                alt="Intus Care Logo"
                width={339}
                height={65} />
        </div>
    </>
}

export default Header