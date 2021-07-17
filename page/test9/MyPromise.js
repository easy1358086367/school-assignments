const MyPromise = (() => {
    const PADDING = 'padding',
        RESOLVE = 'resolve',
        REJECT = 'reject',
        PromiseStatus = Symbol('PromiseStatus'),
        PromiseValue = Symbol('PromiseValue'),
        changeStatus = Symbol('changeStatus'),
        settleHandle = Symbol('settleHandle'),
        successBacks = Symbol('successBacks'),//then的执行函数集
        errorBacks = Symbol('errorBacks'),  //catch的执行函数集
        linkPromise = Symbol('linkPromise')  //用于返回MyPromise对象实现串联调用
        ;

    return class {
        constructor(executor) {
            this[PromiseStatus] = PADDING;
            this[PromiseValue] = undefined;
            this[successBacks] = [];
            this[errorBacks] = []

            const resolve = (data) => {
                this[changeStatus](RESOLVE, data, this[successBacks])
            }
            const reject = (error) => {
                this[changeStatus](REJECT, error, this[errorBacks])
            }
            executor(resolve, reject)
        }
        then(successBack, errorBack) {
            return this[linkPromise](successBack, errorBack)
        }
        catch(errorBack) {
            return this[linkPromise](errorBack)
        }


        /**
         * 改变MyPromise的状态和值
         * @param {*} newStatus 新状态
         * @param {*} newValue 新值
         */
        [changeStatus](newStatus, newValue, queue) {
            if (this[PromiseStatus] == PADDING) {
                this[PromiseStatus] = newStatus;
                this[PromiseValue] = newValue;
                queue.forEach(handle => handle(this[PromiseValue]))
            }
        }
        /**
         * 处理后续函数
         * @param {*} handle 后续处理函数
         * @param {*} immediatelyStatus 需要立即执行的状态
         * @param {*} queue 作业队列
         */
        [settleHandle](handle, immediatelyStatus, queue) {
            if (typeof handle != 'function') return;
            if (this[PromiseStatus] == immediatelyStatus) {
                setTimeout(() => {
                    handle(this[PromiseValue])
                }, 0);
            } else {
                queue.push(handle)
            }
        }
        /**
         * 形成链式调用
         * @param {*} successBack 成功时的回调函数
         * @param {*} errorBack 失败时的运行函数
         * @returns MyPromise
         */
        [linkPromise](successBack, errorBack) {
            return new MyPromise((resolve, reject) => {
                this[settleHandle](data => {
                    try {
                        const result = successBack(data)
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                }, RESOLVE, this[successBacks]);
                this[settleHandle](data => {
                    try {
                        const result = errorBack(data)
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                }, REJECT, this[errorBacks]);
            })
        }
    }
})()