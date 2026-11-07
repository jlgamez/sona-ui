import { motion } from "motion/react";

type ProgressStepsProps = {
  total: number;
  /** Number of finished-or-current steps; that many pills are filled. */
  current: number;
};

export const ProgressSteps = ({ total, current }: ProgressStepsProps) => (
  <div
    role="progressbar"
    aria-label={`Step ${current} of ${total}`}
    aria-valuemin={1}
    aria-valuemax={total}
    aria-valuenow={current}
    className="mx-auto flex w-full max-w-xl gap-2"
  >
    {Array.from({ length: total }, (_, index) => (
      <div
        key={index}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: index < current ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    ))}
  </div>
);
