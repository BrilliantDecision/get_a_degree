class Leukocyte {
    constructor(timeToLive) {
        this.timeToLive = timeToLive;  // time to live
        this.next = null;            // next vertex
        this.path = [];              // path
        this.allow = null;           // allow vertexes
        this.clones = [];            // clones
    }

    addToPath(v) {
        this.path.push(v);
    }

    getPath() {
        return [...this.path];
    }

    initializeAllow(allow) {
        this.allow = allow;
    }

    subAllow(vertex) {
        this.allow = this.allow.filter((v) => v !== vertex);
    }

    getAllow() {
        return [...this.allow];
    }

    addToClones(clones) {
        this.clones.push(...clones);
    }

    subTimeToLive() {
        this.timeToLive -=1;
    }

    setNext(v) {
        this.next = v;
    }

    getNext() {
        return this.next;
    }

    createNext(matrix) {
        this.allow.sort((a,b) => matrix[this.next][a] - matrix[this.next][b]);
        this.next = this.allow[0];
        this.allow = this.allow.filter((v) => v !== this.next);
    }
}