<div align="center">

<img src="assets/slide-cover.png" alt="agent-deck 템플릿 표지" width="720">

# agent-deck

**하나의 HTML 파일로 발표하고, 그 자리에서 수정하고, 페이지당 슬라이드 1장의 16:9 PDF까지.**<br>
AI 에이전트 시대의 슬라이드 — 소스 파일이 곧 플레이어이자 편집기입니다.

[English](README.md)&nbsp;·&nbsp;[简体中文](README.zh-CN.md)&nbsp;·&nbsp;한국어

**[▶ 라이브 데모](https://dengyufan0.github.io/agent-deck/template.html)** — 열고 <kbd>?</kbd> 를 눌러 보세요

</div>

---

> 이 문서는 요약 번역본입니다. 내용이 다를 경우 중국어 문서(README.zh-CN.md, PROMPT.md)가 정본입니다.

## 왜 PowerPoint를 대체하나요?

- **AI 에이전트 친화적** — 순수 텍스트라서 어떤 AI 에이전트든 파일 전체를 읽고 고칠 수 있습니다 (.pptx는 바이너리 블랙박스);
- **발표 중 즉시 수정** — <kbd>E</kbd> 키를 누르면 슬라이드 위에서 바로 편집. 슬라이드쇼를 끄고 다시 켤 필요가 없습니다;
- **버전 기록 내장** — 「새 버전 저장」 시 수정 메모가 파일 안에 기록되고 파일명에 버전 번호가 자동으로 붙습니다;
- **의존성 제로** — CDN·웹폰트 없음, 오프라인에서 더블클릭으로 실행; PDF는 브라우저 인쇄 엔진으로 렌더링됩니다(최종 PDF는 본인 PC의 Chrome/Edge에서 내보내세요).

## 빠른 시작

1. [template.html](template.html)을 Chrome/Edge로 여세요 — 그대로 쓸 수 있는 발표 템플릿입니다;
2. <kbd>→</kbd> 페이지 넘김, <kbd>F</kbd> 전체 화면, 마우스를 움직이면 하단 툴바가 나타납니다;
3. <kbd>E</kbd> 편집 모드 → 「새 버전 저장」 → 버전 기록이 담긴 새 파일 다운로드;
4. 「PDF 내보내기」 → 인쇄 대화상자에서 "PDF로 저장" → 페이지당 슬라이드 1장, 16:9 PDF 완성.

## AI 에이전트로 새 발표 만들기

[PROMPT.md](PROMPT.md)(중국어 정본, 영어판 [PROMPT.en.md](PROMPT.en.md))의 프롬프트를 아무 AI 에이전트에게 붙여 넣으면, 이 계약을 만족하는 슬라이드 파일을 생성/수정해 줍니다. 생성 후 60초 검수 체크리스트로 확인하세요.

## License

[MIT](LICENSE)
