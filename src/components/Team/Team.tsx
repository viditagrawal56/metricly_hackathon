import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import viditImage from "../../assets/vidit_agrawal.jpg";
import aniketImage from "../../assets/aniket_rathod.jpeg";
import pranavImage from "../../assets/pranav_salunkhe.jpg";
import "./Team.css";

const teamMembers = [
  {
    name: "Pranav Salunkhe",
    role: "Full Stack Developer",
    github: "https://github.com/pranav514",
    linkedin: "https://linkedin.com/in/pranav-salunkhe-89926822a",
    twitter: "https://x.com/dronbron1",
    image: pranavImage,
  },
  {
    name: "Vidit Agrawal",
    role: "Full Stack Developer",
    github: "https://github.com/viditagrawal56",
    linkedin: "https://linkedin.com/in/viditagrawal2003",
    twitter: "https://x.com/headreaper26",
    image: viditImage,
  },
  {
    name: "Aniket Rathod",
    role: "Frontend Developer",
    github: "https://github.com/aniirathod",
    linkedin: "https://linkedin.com/in/aniket-rathod0",
    twitter: "https://x.com/aniket__rathod",
    image: aniketImage,
  },
];

const Team = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      id="team"
      className="team-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div className="team-title" variants={item}>
        <h1>Meet Our Team</h1>
        <p>The developers behind Metricly</p>
      </motion.div>
      <motion.div className="team-members" variants={container}>
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="team-card"
            variants={item}
            whileHover={{ scale: 1.02 }}
          >
            <div className="card-content">
              <div className="profile-image-wrapper">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="profile-image"
                  />
                )}
              </div>
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              <div className="social-links">
                <a href={member.github} target="_blank">
                  <FaGithub />
                </a>
                <a href={member.linkedin} target="_blank">
                  <FaLinkedin />
                </a>
                <a href={member.twitter} target="_blank">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Team;
