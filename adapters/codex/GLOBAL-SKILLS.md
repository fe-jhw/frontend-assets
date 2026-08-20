# 전역 Skill 카탈로그

이 문서는 현재 사용자 전역 디렉터리에서 자주 재사용할 Codex 항목을 분류한 adapter 전용 카탈로그다. 설치 위치는 Codex 버전과 환경에 따라 달라질 수 있으므로 실제 상태는 `scripts/audit-global-skills.sh`에서 `CODEX_SKILLS_ROOT`를 지정해 확인한다.

## 기본 유지

| Skill                         | 역할                           | 배치 판단                                     |
| ----------------------------- | ------------------------------ | --------------------------------------------- |
| `react`                       | React 19 구현·리팩터링 기준    | React 프로젝트에서 전역 유지                  |
| `vercel-react-best-practices` | React/Vite/Next 성능 검토      | 전역 유지, 설치 폴더는 `react-best-practices` |
| `react-component-structure`   | 컴포넌트 책임과 추출 경계      | 전역 유지, 구조 리팩터링에 사용               |
| `react-hook-form`             | 설치 버전을 확인한 RHF 폼 구현 | RHF를 쓰는 프로젝트에서 전역 유지             |
| `playwright`                  | 반복 가능한 브라우저 자동화    | 전역 유지, CLI 브라우저 검증이 필요할 때 사용 |

## 작업별 선택

| Skill                     | 사용 조건                                      |
| ------------------------- | ---------------------------------------------- |
| `figma`                   | Figma URL, node, design-to-code 작업이 있을 때 |
| `screenshot`              | OS 수준 화면 캡처가 명시적으로 필요할 때       |
| `review-interface-polish` | 구현된 인터페이스의 시각 완성도를 점검할 때    |
| `hatch-pet`               | Codex pet asset을 만들 때만                    |

## 개인 workflow

`llm-wiki-recall`, `llm-wiki-record`, `llm-wiki-memory`는 개인 vault workflow가 있는 환경에서만 유지한다. 프로젝트 저장소에 복사하거나 팀 기본 요구사항으로 만들지 않는다.

## Codex system-managed

| Skill             | 역할                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `skill-creator`   | 새 skill 생성·수정과 구조 검증                                   |
| `skill-installer` | curated/GitHub skill 설치                                        |
| `openai-docs`     | Codex app/CLI·MCP·automation과 OpenAI 제품의 최신 공식 문서 확인 |
| `plugin-creator`  | 개인 plugin scaffold와 manifest 관리                             |
| `imagegen`        | bitmap image 생성·편집                                           |

이 그룹은 `~/.codex/skills/.system`에서 Codex가 관리한다. 프로젝트나 이 저장소로 복사하지 않고 현재 설치에서 제공되는지 확인만 한다.

plugin·bundled skill은 설치에 따라 `pdf:pdf`처럼 이름이 prefix될 수 있으므로 전역 사용자 폴더에 같은 기능을 복제하지 않는다. 프로젝트 환경과 `AGENTS.md`는 현재 Codex 설정·저장소 파일로 관리하며 별도 bootstrap wrapper를 기본 목록에 두지 않는다.

## 소유권 규칙

- 전역: 기술·도구 전반에 재사용되고 프로젝트마다 본문이 달라지지 않는 skill
- project-local: 검증 명령, 폴더 경계, 브라우저 선택, 배포 흐름처럼 팀과 저장소가 함께 버전 관리해야 하는 skill
- 이 저장소: 여러 프로젝트에 복사할 수 있지만 직접 유지·개선하려는 범용 workflow
- 외부 관리: system/plugin/curated skill. 파일을 vendoring하지 않고 설치 출처만 관리한다.
- Codex 제품 사용법과 설정은 system-managed `openai-docs`가 담당한다. 같은 범위를 다시 감싼 개인 `codex-usage`류 wrapper는 유지하지 않는다.
