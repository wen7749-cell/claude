# Requirements (Core) — distilled from Nexia requirement doc

This file summarizes functional requirements from the uploaded **Nexia（ネクシア）ウェブアプリケーション 要件定義書** and aligns them to **LifeLink (Links/Story/Self)**.

## 1. Users & goals
- Primary: 高齢者（60歳以上）とその家族
- Secondary: お墓の管理に悩む人、遠方の親族、証を残したい人

### Four main goals (from requirement doc)
1. 死後の悩み（墓・管理・継承）を解決
2. 遠い先祖とのつながり
3. 生前から後世に残すものを考える（人生の鏡）
4. 親戚・属性コミュニティによる横のつながり拡大

## 2. Functional requirements mapped to Links/Story/Self
### Links
- Family/relative permissions and sharing
- Digital family tree creation, visualization, collaborative editing
- Virtual visit (online prayer) records and visitor list
- Online ceremonies (temple integration, schedule, participants)

### Story
- Memorial page (deceased profile) create/edit
- Upload media: photos / videos / audio
- Episodes, memories, hobbies, work history
- Public scope controls (self/family/friends/public; per-content overrides)
- Memorial interactions: messages, virtual flowers/incense/candles, anniversary notifications
- Life log with timeline display
- Future letters: scheduled/conditional publishing (incl. after death)

### Self
- Life log prompts (to be designed): reflections, lessons, values
- “Mirror” experience: highlight turning points, relationships, principles (MVP: guided forms)

## 3. Non-functional requirements (initial)
- Security & privacy: strong permission model + audit log (at least for scope changes)
- Reliability: durable storage for media and important records
- Accessibility: senior-friendly UI (large fonts, simple flows)

## 4. MVP scope suggestion (Codex-friendly)
- Auth + profiles
- Memorial pages (Story) with basic media
- Access control (private/family/friends/public)
- Family tree (Links) basic
- Life log + future letter (Story/Self) minimal
