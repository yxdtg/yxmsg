/**
 * 消息系统
 */
export class YxMsg {
    constructor() {
        // 消息列表Map
        this._msgListMap = new Map();
        // 消息id计数
        this._msgId = 0;
    }
    /**
     * 注册消息
     * @param type 消息类型
     * @param cb 消息回调函数
     * @param target 回调函数绑定的目标
     * @param priority 消息执行顺序 越小越优先 默认为0
     * @returns 消息id
     */
    on(type, cb, target = null, priority = 0) {
        const id = ++this._msgId;
        const msg = {
            id: id,
            cb: cb,
            target: target,
            priority: priority,
        };
        let msgList = this._msgListMap.get(type);
        if (msgList) {
            msgList.push(msg);
        }
        else {
            msgList = [msg];
            this._msgListMap.set(type, msgList);
        }
        msgList.sort((a, b) => a.priority - b.priority);
        return msg.id;
    }
    off(...args) {
        const type = args[0];
        if (args.length === 1) {
            this.offAll(type);
            return;
        }
        if (args.length === 2) {
            if (typeof args[1] === 'number') {
                this.offById(type, args[1]);
            }
            else {
                this.offByCb(type, args[1]);
            }
            return;
        }
        if (args.length === 3) {
            const cb = args[1];
            const target = args[2];
            this.offByCb(type, cb, target);
            return;
        }
    }
    offByCb(type, cb, target = null) {
        const msgList = this._msgListMap.get(type);
        if (!msgList)
            return;
        if (target) {
            const index = msgList.findIndex((msg) => msg.cb === cb && msg.target === target);
            if (index !== -1)
                msgList.splice(index, 1);
        }
        else {
            const index = msgList.findIndex((msg) => msg.cb === cb);
            if (index !== -1)
                msgList.splice(index, 1);
        }
    }
    offById(type, id) {
        const msgList = this._msgListMap.get(type);
        if (!msgList)
            return;
        const index = msgList.findIndex((msg) => msg.id === id);
        if (index !== -1)
            msgList.splice(index, 1);
    }
    offAll(type) {
        if (this._msgListMap.has(type)) {
            this._msgListMap.delete(type);
        }
    }
    /**
     * 发射消息
     * @param type 消息类型
     * @param args 消息参数
     */
    emit(type, ...args) {
        const msgList = this._msgListMap.get(type);
        if (!msgList)
            return;
        msgList.forEach((msg) => {
            if (msg.target) {
                msg.cb.call(msg.target, ...args);
            }
            else {
                msg.cb(...args);
            }
        });
    }
}
