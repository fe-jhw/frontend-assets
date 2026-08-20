---
name: frontend-bundle-audit
description: "Vite 또는 유사 SPA의 production bundle 크기, analyzer, chunk 구성, size budget을 명시적으로 진단할 때만 사용한다. routine verification이나 일반 코드 변경에는 자동 적용하지 않으며 새 analyzer dependency를 승인 없이 설치하지 않는다."
---

# Frontend Bundle Audit

Production build의 전송 비용과 lazy boundary를 action 가능한 수준으로 진단한다.

## 절차

1. `AGENTS.md`, package scripts, build config, route lazy import를 확인한다.
2. analyzer 또는 size budget 도구가 이미 있는지 찾는다.
3. 대상 프로젝트의 build command를 실행한다. 실패하면 analyzer보다 build blocker를 먼저 보고한다.
4. 기존 analyzer가 있으면 그 script를 사용한다.
5. 없다면 새 package를 설치하지 않고 아래 fallback을 실행한다.

```bash
node /path/to/frontend-bundle-audit/scripts/report-build-assets.mjs dist
```

6. initial entry, route chunk, CSS, source map을 구분하고 큰 파일이 실제 초기 사용자 flow에 들어오는지 import graph로 확인한다.

## 판단

- raw size보다 gzip/brotli 전송량과 loading 시점을 우선한다.
- chunk 개수가 많다는 이유만으로 합치지 않는다.
- framework runtime을 억지로 쪼개거나 package 이름 목록을 baseline chunk config로 고정하지 않는다.
- barrel import, eager route import, locale/editor/chart 전체 import처럼 근거가 있는 원인만 제시한다.
- 새 analyzer, source map, size budget 설정이 필요하면 별도 제안으로 분리한다.

## 보고

- build/analyzer command와 결과
- 상위 JS/CSS asset의 raw, gzip, brotli 크기
- initial/async 여부를 확인한 방법
- 개선 후보와 예상되는 사용자 flow 영향
- source map 또는 import graph가 없어 생긴 분석 한계
