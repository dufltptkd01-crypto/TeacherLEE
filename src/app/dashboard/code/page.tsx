"use client";

import { useState } from "react";

const defaultCode = `// 🇰🇷 한국어 + JavaScript 동시 학습!
// "짝수"는 even number, "거르다"는 to filter

function filterEven(arr) {
  // 여기에 코드를 작성하세요
  // 배열에서 짝수만 필터링하는 함수입니다
  
}

// 테스트
console.log(filterEven([1, 2, 3, 4, 5, 6]));
// 예상 결과: [2, 4, 6]
`;

const codeReviewFeedback = [
    {
        type: "success" as const,
        line: "Line 5",
        text: "filter() 메서드를 잘 사용했어요!",
    },
    {
        type: "tip" as const,
        line: "Line 5",
        text: '화살표 함수로 더 간결하게: arr.filter(n => n % 2 === 0)',
    },
    {
        type: "lang" as const,
        line: "주석",
        text: '📝 "나머지"는 remainder, "나누다"는 to divide',
    },
];

const problems = [
    { id: 1, title: "짝수 필터링", difficulty: "초급", xp: 10, done: false },
    { id: 2, title: "문자열 뒤집기", difficulty: "초급", xp: 10, done: true },
    { id: 3, title: "배열 합계 구하기", difficulty: "초급", xp: 15, done: false },
    { id: 4, title: "팰린드롬 확인", difficulty: "중급", xp: 20, done: false },
    { id: 5, title: "정렬 알고리즘", difficulty: "중급", xp: 25, done: false },
];

export default function CodePage() {
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState("");
    const [showReview, setShowReview] = useState(false);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

    const runCode = () => {
        try {
            const logs: string[] = [];
            const mockConsole = {
                log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
            };
            const fn = new Function("console", code);
            fn(mockConsole);
            setOutput(logs.join("\n") || "(출력 없음)");
        } catch (err) {
            setOutput(`❌ Error: ${(err as Error).message}`);
        }
    };

    const requestReview = () => {
        setShowReview(true);
    };

    return (
        <div className="h-screen lg:h-screen flex flex-col">
            {/* Top Bar */}
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-4 lg:px-6 py-3 flex items-center gap-3">
                <span className="text-lg">💻</span>
                <h1 className="text-sm font-semibold text-[var(--text-primary)] flex-1">
                    JS 배열 필터링
                </h1>
                <div className="flex items-center gap-2">
                    <span className="glass rounded-full px-3 py-1 text-xs text-[var(--text-muted)]">
                        ⏱ 초급
                    </span>
                    <span className="glass rounded-full px-3 py-1 text-xs text-[var(--accent)] font-semibold">
                        +10 XP
                    </span>
                </div>
                <button className="glass rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    💡 힌트
                </button>
                <button
                    onClick={requestReview}
                    className="btn-primary text-xs !py-1.5 !px-4"
                >
                    🤖 AI 리뷰
                </button>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left: Problem List (Desktop) */}
                <div className="hidden lg:flex flex-col w-56 border-r border-[var(--border)] bg-[var(--bg-secondary)]/30 shrink-0">
                    <div className="p-3 border-b border-[var(--border)]">
                        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Problems
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {problems.map((p) => (
                            <button
                                key={p.id}
                                className={`w-full text-left p-2.5 rounded-lg transition-all text-xs ${p.id === 1
                                        ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30"
                                        : "hover:bg-[var(--bg-card)]"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${p.done
                                                ? "bg-[var(--secondary)] text-white"
                                                : "border border-[var(--border)]"
                                            }`}
                                    >
                                        {p.done ? "✓" : ""}
                                    </span>
                                    <span className={`flex-1 font-medium ${p.done ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                                        {p.title}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-1 ml-6">
                                    <span className="text-[10px] text-[var(--text-muted)]">{p.difficulty}</span>
                                    <span className="text-[10px] text-[var(--accent)]">+{p.xp} XP</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center: Code Editor + Output */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Tab Bar */}
                    <div className="flex border-b border-[var(--border)] bg-[var(--bg-secondary)]/30 px-2">
                        <button
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${activeTab === "code"
                                    ? "border-[var(--primary)] text-[var(--primary-light)]"
                                    : "border-transparent text-[var(--text-muted)]"
                                }`}
                            onClick={() => setActiveTab("code")}
                        >
                            📝 solution.js
                        </button>
                        <button
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${activeTab === "preview"
                                    ? "border-[var(--primary)] text-[var(--primary-light)]"
                                    : "border-transparent text-[var(--text-muted)]"
                                }`}
                            onClick={() => setActiveTab("preview")}
                        >
                            🌐 Preview
                        </button>
                        <div className="flex-1" />
                        <button
                            onClick={runCode}
                            className="my-1 px-4 py-1 rounded-lg bg-[var(--secondary)] text-white text-xs font-medium hover:bg-[var(--secondary-light)] transition-colors"
                        >
                            ▶ 실행
                        </button>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 min-h-0">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#0d1117] text-[#e6edf3] p-4 text-sm leading-6 outline-none resize-none"
                            style={{ fontFamily: "var(--font-mono), JetBrains Mono, monospace", tabSize: 2 }}
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="shrink-0 border-t border-[var(--border)] bg-[#0d1117]">
                        <div className="flex items-center px-4 py-2 border-b border-[var(--border)]">
                            <span className="text-xs font-medium text-[var(--text-muted)]">
                                Console Output
                            </span>
                        </div>
                        <div className="p-4 h-28 overflow-y-auto">
                            {output ? (
                                <pre className="text-sm text-[var(--secondary-light)] font-mono whitespace-pre-wrap">
                                    {output}
                                </pre>
                            ) : (
                                <p className="text-xs text-[var(--text-muted)]">
                                    ▶ 실행 버튼을 눌러 결과를 확인하세요
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: AI Review Panel */}
                <div
                    className={`lg:w-80 border-l border-[var(--border)] bg-[var(--bg-secondary)]/30 flex flex-col shrink-0 transition-all ${showReview ? "block" : "hidden lg:flex"
                        }`}
                >
                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            🤖 AI 코드 리뷰
                        </h3>
                        <button
                            onClick={() => setShowReview(false)}
                            className="lg:hidden text-[var(--text-muted)]"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-14 lg:mb-0">
                        {showReview ? (
                            <>
                                {codeReviewFeedback.map((f, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-xl border text-xs ${f.type === "success"
                                                ? "border-[var(--secondary)]/30 bg-[var(--secondary)]/5"
                                                : f.type === "tip"
                                                    ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                                                    : "border-[var(--accent)]/30 bg-[var(--accent)]/5"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>
                                                {f.type === "success"
                                                    ? "✅"
                                                    : f.type === "tip"
                                                        ? "💡"
                                                        : "📝"}
                                            </span>
                                            <span className="font-medium text-[var(--text-secondary)]">
                                                {f.line}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] leading-relaxed">
                                            {f.text}
                                        </p>
                                    </div>
                                ))}

                                <div className="pt-3">
                                    <button className="w-full btn-secondary text-xs justify-center">
                                        🗣️ AI에게 질문하기
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-3xl mb-3">🤖</p>
                                <p className="text-xs text-[var(--text-muted)]">
                                    코드를 작성한 후
                                    <br />
                                    &quot;AI 리뷰&quot; 버튼을 눌러보세요
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
