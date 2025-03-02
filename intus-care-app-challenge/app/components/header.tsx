import Link from "next/link";
import Image from "next/image";

const Header = () => {
    const headerStyles = {
        backgroundColor: "var(--grayscale-white)", 
        boxShadow: '0px 0.4px 0.4rem 0.06rem var(--grayscale-black50)'
    }

    return <>
        <div className="p-5" style={headerStyles}>
            <Link href="/">
                <Image 
                    src={'../images/logo_IntusCare.svg'} 
                    alt="Intus Care Logo"
                    placeholder="blur"
                    width={339}
                    height={65}
                    blurDataURL="data:image/png;base64,..."
                />
            </Link>
        </div>
    </>
}

export default Header