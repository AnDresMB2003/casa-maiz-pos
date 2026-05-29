import { motion } from "framer-motion";

function StatsCard({
  title,
  value,
  icon,
  color,
  percentage,
  delay,
}) {

  return (
    <motion.div

      initial={{
        opacity: 0,
        y: 30,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        delay,
      }}

      whileHover={{
        y: -5,
      }}

      className="
        rounded-[36px]
        border
        border-white/[0.06]
        bg-gradient-to-br
        from-white/[0.04]
        to-white/[0.02]
        p-7
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p className="text-gray-400">
            {title}
          </p>

          <h2
            className="
              mt-5
              text-5xl
              font-black
            "
          >
            {value}
          </h2>

          <div
            className="
              mt-4
              inline-flex
              items-center
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
            "
            style={{
              backgroundColor:
                `${color}20`,
              color,
            }}
          >
            +{percentage}
          </div>

        </div>

        <div
          className="
            rounded-3xl
            p-5
          "
          style={{
            backgroundColor:
              `${color}20`,
            color,
          }}
        >
          {icon}
        </div>

      </div>

    </motion.div>
  );
}

export default StatsCard;