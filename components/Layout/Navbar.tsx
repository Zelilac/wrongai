import { FC } from "react";

<>

</>;

export const Navbar: FC = () => {
  return (
    <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
      <div className="flex items-center">
        <img
          src="/wrongcoin-logo.png"
          alt="Logo"
          className="h-10 sm:h-12 w-auto"
        />
        <div className="text-white ml-3 font-bold text-base sm:text-lg flex items-center">
          <span className="title-text">WrongCoin</span>
        </div>
      </div>
    </div>
  );
};
