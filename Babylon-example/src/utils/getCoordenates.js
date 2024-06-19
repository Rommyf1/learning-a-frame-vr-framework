export const randomHorizontalPosition = () => {
    let position = Math.random() * 2;
    const modificator = Math.random() * 1;
    return (modificator >= 0.5) ? (position) : (-position);
  };

export const randomVerticalPosition = () => {
    let position = ((Math.random() * 2) + 1);
    return position;
  };