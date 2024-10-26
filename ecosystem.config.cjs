module.exports = {
    apps: [{
	    name: "api-server",                               // 이름
        script: "run.sh",                             // 실행할 main 파일
        interpreter: "/home/jinpyo/.asdf/shims/pnpm",  // pnpm 경로
    },],
};
