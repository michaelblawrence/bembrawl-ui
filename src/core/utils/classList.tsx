export type ClassNameList = {
  [className: string]: boolean | any;
};

export function classList(list: ClassNameList): string {
  return Object.entries(list)
    .filter(([_, enabled]) => enabled)
    .map(([className, _]) => className)
    .join(" ");
}
