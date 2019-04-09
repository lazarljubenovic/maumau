type GetActions<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>
