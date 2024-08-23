import { ArcadeIcon } from "./ArcadeIcon.tsx";
import { AdvancedIcon } from "./AdvancedIcon.tsx";
import { ProIcon } from "./ProIcon.tsx";

interface IconProps {
  iconType: IconTypes;
}

export const Icon: React.FC<IconProps> = ({ iconType }) => {
  switch (iconType) {
    case IconTypes.ArcadeIcon:
      return <ArcadeIcon />;
    case IconTypes.AdvancedIcon:
      return <AdvancedIcon />;
    case IconTypes.ProIcon:
      return <ProIcon />;
  }
};

export enum IconTypes {
  ArcadeIcon = "ArcadeIcon",
  AdvancedIcon = "AdvancedIcon",
  ProIcon = "ProIcon",
}
