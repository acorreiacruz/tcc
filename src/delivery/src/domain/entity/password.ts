
export class Password {
    static Format =
        /^(?=.*[A-Z])(?=.*[!@#$)%={+{(&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

    static isStrong(value: string): boolean {
        return Password.Format.test(value);
    }

}
