import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-primary text-white">
      <div>
        <p>Made with ❤️ by <Link href={"https://solteria.xyz"}>solteria.xyz</Link> for the Gritnova Blockchain Cohort</p>
      </div>
    </footer>
  );
};

export default Footer;
