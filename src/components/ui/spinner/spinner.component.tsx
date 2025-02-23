const Spinner: React.FC<{ size?: "sm" | "md" }> = ({ size = "sm" }) => (
  <div
    className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${
      size === "sm" ? "h-4 w-4" : "h-6 w-6"
    }`}
    role="status"
  />
);

export default Spinner;
