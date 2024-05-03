/**
 * 消息系统
 */
export class YxMsg {
    constructor() {
        // 消息列表Map
        this.__msgListMap = new Map();
        // 消息id
        this.__msgId = 0;
    }
    /**
     * 注册消息
     * @param type 消息类型
     * @param cb 消息回调函数
     * @param target 回调函数绑定的目标
     * @param priority 消息执行优先级 默认为0
     * @returns 消息id
     */
    on(type, cb, target = null, priority = 0) {
        const id = ++this.__msgId;
        const msg = {
            id: id,
            cb: cb,
            target: target,
            priority: priority,
        };
        let msgList = this.__msgListMap.get(type);
        if (msgList) {
            msgList.push(msg);
        }
        else {
            msgList = [msg];
            this.__msgListMap.set(type, msgList);
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
            const id = args[1];
            this.offById(type, id);
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
        const msgList = this.__msgListMap.get(type);
        if (!msgList)
            return;
        const index = msgList.findIndex((msg) => msg.cb === cb && msg.target === target);
        if (index !== -1)
            msgList.splice(index, 1);
    }
    offById(type, id) {
        const msgList = this.__msgListMap.get(type);
        if (!msgList)
            return;
        const index = msgList.findIndex((msg) => msg.id === id);
        if (index !== -1)
            msgList.splice(index, 1);
    }
    offAll(type) {
        if (this.__msgListMap.has(type)) {
            this.__msgListMap.delete(type);
        }
    }
    /**
     * 发射消息
     * @param type 消息类型
     * @param args 消息参数
     */
    emit(type, ...args) {
        const msgList = this.__msgListMap.get(type);
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
