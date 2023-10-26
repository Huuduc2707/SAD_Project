export const ErrorPage: React.FC<{
  title: string;
  message: string;
}> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4 px-8 py-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {title}
      </h1>
      <p className="leading-7 mt-8">{message}</p>
    </div>
  );
};
