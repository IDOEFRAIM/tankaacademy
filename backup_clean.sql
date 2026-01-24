--

-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PublishStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PublishStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED'
);


ALTER TYPE public."PublishStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'INSTRUCTOR',
    'STUDENT'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _AttachmentToLesson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_AttachmentToLesson" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_AttachmentToLesson" OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    course_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapters (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "position" integer NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    course_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chapters OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    user_id text NOT NULL,
    lesson_id text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    instructor_id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    price double precision,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    category_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    currency text DEFAULT 'EUR'::text NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: lesson_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_likes (
    id text NOT NULL,
    user_id text NOT NULL,
    lesson_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.lesson_likes OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    video_url text,
    "position" integer NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    is_free boolean DEFAULT false NOT NULL,
    chapter_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    id text NOT NULL,
    text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    question_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.options OWNER TO postgres;

--
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    price double precision
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id text NOT NULL,
    text text NOT NULL,
    quiz_id text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id text NOT NULL,
    title text NOT NULL,
    lesson_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    key text NOT NULL,
    value text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id text NOT NULL,
    user_id text NOT NULL,
    lesson_id text NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    email_verified timestamp(3) without time zone,
    image text,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    password text,
    is_suspended boolean DEFAULT false NOT NULL,
    suspended_at timestamp(3) without time zone,
    suspended_reason text,
    suspended_until timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _AttachmentToLesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_AttachmentToLesson" ("A", "B") FROM stdin;
cmjrtxzhj0004xg93rqnyt98p	cmjrsgrtj000d1o9367niqxwa
cmjrtxzhj0004xg93rqnyt98p	cmjrsgvx3000e1o9313w9qlb1
cmjrtxqxe0003xg93r89gz166	cmjrsgvx3000e1o9313w9qlb1
cmjrtxqxe0003xg93r89gz166	cmjrsh3e2000f1o93czzxaf92


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, name, url, course_id, created_at, updated_at) FROM stdin;
cmjrr661p00001o93x0ua1dbc	1767048697907-cahierDechargeAC.docx	/uploads/1767048697907-cahierDechargeAC.docx	cmjrnkbg8000210935zura2bl	2025-12-29 22:51:38.652	2025-12-29 22:51:38.652
cmjrr6kzp00011o93xatdt9qj	1767048717422-AgriConnect.docx	/uploads/1767048717422-AgriConnect.docx	cmjrnkbg8000210935zura2bl	2025-12-29 22:51:58.021	2025-12-29 22:51:58.021
cmjrrolkg00041o93vybs9x62	1767049558279-Travauxdirigs1CCA2025.pdf	/uploads/1767049558279-Travauxdirigs1CCA2025.pdf	cmjrrmnzf00021o93zlfharob	2025-12-29 23:05:58.576	2025-12-29 23:05:58.576
cmjrtxqxe0003xg93r89gz166	1767053344074-Au-dela-de-ChatGPT-Gemini-Comment-donner-un-cerveau-et-une-memoire-a-lIA-grace-au-RAG.pdf	/uploads/1767053344074-Au-dela-de-ChatGPT-Gemini-Comment-donner-un-cerveau-et-une-memoire-a-lIA-grace-au-RAG.pdf	cmjrsdq5r000b1o930l4s7z6h	2025-12-30 00:09:04.658	2025-12-30 00:09:04.658
cmjrtxzhj0004xg93rqnyt98p	1767053355067-EfraimMarieDieudonneIdoResume.pdf3.pdf	/uploads/1767053355067-EfraimMarieDieudonneIdoResume.pdf3.pdf	cmjrsdq5r000b1o930l4s7z6h	2025-12-30 00:09:15.751	2025-12-30 00:09:15.751


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
cmjrri3pe0001qc93i7x9ykuj	Musique
cmjrri3pe0002qc93ceu74vec	Fitness
cmjrri3pe0003qc93m95jq6kw	Photographie
cmjrri3pe0005qc93bm58muru	Ing+�nierie
cmjrri3pe0006qc93syiy4r2g	Cin+�ma
cmjrwr5bs0001uw93y1lbnkc0	algebre
cmjrri3pe0004qc9379vxaxhp	Compta
cmjrri3pe0000qc9353e8pvzv	Informatique-ia
cmk6rum5d0000mk93vhinqzg1	Python Development
cmk76oom600000w938n2y8h85	Informatique


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapters (id, title, description, "position", status, course_id, created_at, updated_at) FROM stdin;
cmk76ooug00020w935cghmiid	Niveau 1 : Les Bases	\N	1	PUBLISHED	cmk76oot900010w931hcjk05p	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowd000b0w938eaa4j9n	Niveau 2 : Interm+�diaire	\N	2	PUBLISHED	cmk76oot900010w931hcjk05p	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oox4000m0w938ppxfd19	Niveau 3 : Avanc+�	\N	3	PUBLISHED	cmk76oot900010w931hcjk05p	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxl000u0w93wi8bwvfv	Projets & TP	\N	4	PUBLISHED	cmk76oot900010w931hcjk05p	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk9tt0p80000uo93fiavw0qk	Qu'est ce que python?	Comprendre la philosophie de python	0	DRAFT	cmk6slazk0000ng93gqpkw977	2026-01-11 14:25:15.212	2026-01-11 14:26:49.633
cmjro1y150003109329gqpno8	intro du cours	comment faire une bonne intro	0	PUBLISHED	cmjrnkbg8000210935zura2bl	2025-12-29 21:24:22.793	2025-12-29 22:39:00.766
cmjro2a4z00041093achii2fe	developpement	\N	2	DRAFT	cmjrnkbg8000210935zura2bl	2025-12-29 21:24:38.482	2025-12-29 22:39:00.798
cmjro2nqb00051093us23udux	rapport	\N	1	DRAFT	cmjrnkbg8000210935zura2bl	2025-12-29 21:24:56.099	2025-12-29 22:49:32.558
cmjrrprr400051o93uwooij80	proba	\N	2	DRAFT	cmjrrmnzf00021o93zlfharob	2025-12-29 23:06:53.248	2025-12-29 23:06:53.248
cmjrrns1d00031o93to7w0e3g	statistique	comment manier la stat	1	PUBLISHED	cmjrrmnzf00021o93zlfharob	2025-12-29 23:05:20.305	2025-12-29 23:07:38.06
cmjrux6190004yc93p78j8euu	notion d ia	connaitre un l ia pour le piratage,automatiser les hack	3	PUBLISHED	cmjrsdq5r000b1o930l4s7z6h	2025-12-30 00:36:37.196	2025-12-30 00:47:45.94
cmjruomhk0000yc93ovaebgw0	ransomware	comment envoyer des virus	0	PUBLISHED	cmjrsdq5r000b1o930l4s7z6h	2025-12-30 00:29:58.616	2025-12-30 19:27:47.044
cmjrsg0gd000c1o93j0pwpa3d	intro au reseau	type de reseau,protocole	1	PUBLISHED	cmjrsdq5r000b1o930l4s7z6h	2025-12-29 23:27:17.581	2025-12-30 19:27:47.055
cmk6slazz0001ng93ynxeh8mu	Introduction Python & Installation	Chapter for Introduction Python & Installation	1	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.167	2026-01-11 14:25:25.029
cmk6slb1i0005ng93tztacdag	Op+�rateurs & Conditions	Chapter for Op+�rateurs & Conditions	2	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.222	2026-01-11 14:25:25.036
cmk6slb2l0009ng9381nab8dd	Listes & Tuples	Chapter for Listes & Tuples	5	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.261	2026-01-11 14:25:25.056
cmk6slb0q0003ng93yith1z82	Bases & Syntaxe	Chapter for Bases & Syntaxe	3	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.194	2026-01-11 14:25:25.043
cmk6slb240007ng93pbl26ge8	Boucles (For, While)	Chapter for Boucles (For, While)	4	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.243	2026-01-11 14:25:25.05
cmk6slb33000bng93nlp2whpt	Dictionnaires	Chapter for Dictionnaires	6	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.279	2026-01-11 14:25:25.063
cmk6slb3m000dng931rgaa96b	Fonctions	Chapter for Fonctions	7	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.298	2026-01-11 14:25:25.07
cmk6slb44000fng933lolmbye	Modules & Gestion des Erreurs	Chapter for Modules & Gestion des Erreurs	8	PUBLISHED	cmk6slazk0000ng93gqpkw977	2026-01-09 11:27:57.316	2026-01-11 14:25:25.078
cmk6slb5a000ing932evf8tmo	Gestion de Fichiers	Chapter for Gestion de Fichiers	1	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.358	2026-01-09 11:27:57.358
cmk6slb5t000kng93sgfbekhq	Compr+�hensions de Listes	Chapter for Compr+�hensions de Listes	2	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.377	2026-01-09 11:27:57.377
cmk6slb6x000mng93jlnyiu7k	POO - Classes et Objets	Chapter for POO - Classes et Objets	3	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.417	2026-01-09 11:27:57.417
cmk6slb82000ong93jql2zu8x	POO - H+�ritage et Polymorphisme	Chapter for POO - H+�ritage et Polymorphisme	4	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.458	2026-01-09 11:27:57.458
cmk6slb8t000qng935dm09mb2	Fonctions Avanc+�es (Lambda, Decorateurs)	Chapter for Fonctions Avanc+�es (Lambda, Decorateurs)	5	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.485	2026-01-09 11:27:57.485
cmk6slb9w000sng9360yi3c4m	D+�corateurs	Chapter for D+�corateurs	6	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.524	2026-01-09 11:27:57.524
cmk6slbay000ung93evqrvke8	It+�rateurs & G+�n+�rateurs	Chapter for It+�rateurs & G+�n+�rateurs	7	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.562	2026-01-09 11:27:57.562
cmk6slbc1000wng93u50bx9pq	S+�rialisation (JSON, CSV)	Chapter for S+�rialisation (JSON, CSV)	8	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.601	2026-01-09 11:27:57.601
cmk6slbcl000yng93qq0qgq6g	Dates & Heures	Chapter for Dates & Heures	9	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.621	2026-01-09 11:27:57.621
cmk6slbd30010ng93stzpvm03	R+�cursivit+�	Chapter for R+�cursivit+�	10	PUBLISHED	cmk6slb4r000hng93xn5rsgkm	2026-01-09 11:27:57.639	2026-01-09 11:27:57.639
cmk6slbds0013ng93cltl3bol	Requ+�tes API	Chapter for Requ+�tes API	1	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.664	2026-01-09 11:27:57.664
cmk6slbeb0015ng93anq2jpct	Expressions R+�guli+�res (Regex)	Chapter for Expressions R+�guli+�res (Regex)	2	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.683	2026-01-09 11:27:57.683
cmk6slbfe0017ng93wat8tzmm	Bases de Donn+�es (SQLite)	Chapter for Bases de Donn+�es (SQLite)	3	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.722	2026-01-09 11:27:57.722
cmk6slbgs0019ng93kueuz43m	Intro Data Science (Pandas)	Chapter for Intro Data Science (Pandas)	4	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.772	2026-01-09 11:27:57.772
cmk6slbhv001bng93ey42j37j	Tests Unitaires	Chapter for Tests Unitaires	5	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.811	2026-01-09 11:27:57.811
cmk6slbiv001dng933t1pnetw	Programmation Asynchrone	Chapter for Programmation Asynchrone	6	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.847	2026-01-09 11:27:57.847
cmk6slbjh001fng93xkj2hfmv	Gestionnaires de Contexte & Typage	Chapter for Gestionnaires de Contexte & Typage	7	PUBLISHED	cmk6slbdk0012ng93yo1k6s4r	2026-01-09 11:27:57.868	2026-01-09 11:27:57.868
cmk6slbkr001ing93pmi7r6wa	Bases et Lecture	Chapter for Bases et Lecture	1	PUBLISHED	cmk6slbki001hng93sw5wsqes	2026-01-09 11:27:57.915	2026-01-09 11:27:57.915
cmk6slbl6001kng938a61ghke	Manipulation & Filtrage	Chapter for Manipulation & Filtrage	2	PUBLISHED	cmk6slbki001hng93sw5wsqes	2026-01-09 11:27:57.93	2026-01-09 11:27:57.93
cmk6slbln001mng93ra7l2ge4	GroupBy & Analyse	Chapter for GroupBy & Analyse	3	PUBLISHED	cmk6slbki001hng93sw5wsqes	2026-01-09 11:27:57.947	2026-01-09 11:27:57.947
cmk6slbmb001ong93c3s8k9gj	Fusion & Temporel	Chapter for Fusion & Temporel	4	PUBLISHED	cmk6slbki001hng93sw5wsqes	2026-01-09 11:27:57.971	2026-01-09 11:27:57.971
cmk6slbn0001rng93qx7zfb52	Bases NumPy	Chapter for Bases NumPy	1	PUBLISHED	cmk6slbms001qng93noqnqt0c	2026-01-09 11:27:57.996	2026-01-09 11:27:57.996
cmk6slbnf001tng937lcaryjc	Op+�ration Broadcasting	Chapter for Op+�ration Broadcasting	2	PUBLISHED	cmk6slbms001qng93noqnqt0c	2026-01-09 11:27:58.011	2026-01-09 11:27:58.011
cmk6slbnu001vng93syrfbqq5	Indexing Slicing Avanc+�	Chapter for Indexing Slicing Avanc+�	3	PUBLISHED	cmk6slbms001qng93noqnqt0c	2026-01-09 11:27:58.026	2026-01-09 11:27:58.026
cmk6slbok001yng93ziq76vew	Matplotlib Bases	Chapter for Matplotlib Bases	1	PUBLISHED	cmk6slboc001xng939um0bnqj	2026-01-09 11:27:58.052	2026-01-09 11:27:58.052
cmk6slbp10020ng93tsie1vaz	Types Graphiques	Chapter for Types Graphiques	2	PUBLISHED	cmk6slboc001xng939um0bnqj	2026-01-09 11:27:58.069	2026-01-09 11:27:58.069
cmk6slbpj0022ng935b4t9amk	Subplots	Chapter for Subplots	3	PUBLISHED	cmk6slboc001xng939um0bnqj	2026-01-09 11:27:58.086	2026-01-09 11:27:58.086
cmk6slbq00024ng93brp20mal	Seaborn	Chapter for Seaborn	4	PUBLISHED	cmk6slboc001xng939um0bnqj	2026-01-09 11:27:58.104	2026-01-09 11:27:58.104
cmk6slbqu0027ng932uytmdel	Concepts IA	Chapter for Concepts IA	1	PUBLISHED	cmk6slbql0026ng93q3pp5imb	2026-01-09 11:27:58.134	2026-01-09 11:27:58.134
cmk6slbra0029ng93ym61j3hb	R+�gression Lin+�aire	Chapter for R+�gression Lin+�aire	2	PUBLISHED	cmk6slbql0026ng93q3pp5imb	2026-01-09 11:27:58.15	2026-01-09 11:27:58.15
cmk6slbrs002bng93qw5xcr8j	Classification KNN	Chapter for Classification KNN	3	PUBLISHED	cmk6slbql0026ng93q3pp5imb	2026-01-09 11:27:58.168	2026-01-09 11:27:58.168


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, user_id, lesson_id, is_deleted, created_at, updated_at) FROM stdin;
cmjrtoryq0000xg939hpg245l	tres beau cours	cmjrs54ed00091o93md54w5dj	cmjrsgrtj000d1o9367niqxwa	f	2025-12-30 00:02:06.098	2025-12-30 00:02:06.098
cmjrtpisk0001xg93uu763hlj	toi meme tu dis ko...Ido tu deviens quoi	cmjrs54ed00091o93md54w5dj	cmjrsgvx3000e1o9313w9qlb1	f	2025-12-30 00:02:40.868	2025-12-30 00:02:40.868


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, instructor_id, title, slug, description, image, price, status, category_id, created_at, updated_at, currency) FROM stdin;
cmjrrmnzf00021o93zlfharob	cmjrnc4wc00011093elzww4a8	data science	data-science-1767049468391	<p>manier&nbsp;la&nbsp;<strong>data</strong></p>	/uploads/1767049494524-logoAG.jpg	0	PUBLISHED	cmjrri3pe0005qc93bm58muru	2025-12-29 23:04:28.394	2025-12-29 23:08:38.245	EUR
cmjrnkbg8000210935zura2bl	cmjrnc4wc00011093elzww4a8	web avance	web-avance-1767042640373	la vie de merde	/uploads/1767043308843--visualselection9.png	66	DRAFT	cmjrri3pe0000qc9353e8pvzv	2025-12-29 21:10:40.376	2025-12-29 23:09:55.304	MAD
cmjrrxk2i00081o93fna57bjw	cmjrnc4wc00011093elzww4a8	developpement mobile:flutter	developpement-mobile-flutter-1767049976536	\N	\N	\N	DRAFT	\N	2025-12-29 23:12:56.538	2025-12-29 23:12:56.538	EUR
cmk6slb4r000hng93xn5rsgkm	cmjrsd9gk000a1o93ljyw1ubc	Python - Niveau 2 : Interm+�diaire	python-niveau-2-intermdiaire	Approfondissez vos connaissances avec la POO, la gestion de fichiers et les structures avanc+�es.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:57.339	2026-01-09 11:27:57.339	EUR
cmk6slbdk0012ng93yo1k6s4r	cmjrsd9gk000a1o93ljyw1ubc	Python - Niveau 3 : Avanc+�	python-niveau-3-avanc	Devenez un expert Python : API, Bases de donn+�es, Tests unitaires et Programmation asynchrone.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:57.656	2026-01-09 11:27:57.656	EUR
cmjrsdq5r000b1o930l4s7z6h	cmjrsd9gk000a1o93ljyw1ubc	hacking	hacking-1767050730924	<p>comment&nbsp;hacker&nbsp;n&nbsp;importe&nbsp;qui</p>	/uploads/1767050762170-loss.png	0	PUBLISHED	cmjrri3pe0000qc9353e8pvzv	2025-12-29 23:25:30.927	2025-12-29 23:33:49.775	EUR
cmk6slbki001hng93sw5wsqes	cmjrsd9gk000a1o93ljyw1ubc	Python - Data Science : Pandas	python-data-science-pandas	Ma+�trisez la manipulation et l'analyse de donn+�es avec la librairie Pandas.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:57.906	2026-01-09 11:27:57.906	EUR
cmk6slbms001qng93noqnqt0c	cmjrsd9gk000a1o93ljyw1ubc	Python - Data Science : NumPy	python-data-science-numpy	Calcul scientifique et manipulation de tableaux multidimensionnels avec NumPy.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:57.988	2026-01-09 11:27:57.988	EUR
cmk6slboc001xng939um0bnqj	cmjrsd9gk000a1o93ljyw1ubc	Python - Data Science : Visualization	python-data-science-visualization	Cr+�ez des graphiques impactants avec Matplotlib et Seaborn.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:58.044	2026-01-09 11:27:58.044	EUR
cmk6slbql0026ng93q3pp5imb	cmjrsd9gk000a1o93ljyw1ubc	Python - Machine Learning	python-machine-learning	Introduction +� l'apprentissage automatique avec Scikit-Learn.	\N	\N	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:58.125	2026-01-09 11:27:58.125	EUR
cmk76oot900010w931hcjk05p	cmjrsd9gk000a1o93ljyw1ubc	Formation Compl+�te Python : De D+�butant +� Expert	python-complete-formation-1767981749561	<p>Ma+�trisez Python, de la syntaxe de base aux concepts avanc+�s en passant par l'analyse de donn+�es et le d+�veloppement asynchrone.</p><p>Ce cours est structur+� en 3 niveaux : D+�butant, Interm+�diaire et Avanc+�.</p>	https://www.python.org/static/community_logos/python-logo-master-v3-TM.png	\N	PUBLISHED	cmk76oom600000w938n2y8h85	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606	EUR
cmk6slazk0000ng93gqpkw977	cmjrsd9gk000a1o93ljyw1ubc	Python - Niveau 1 : Les Bases	python-niveau-1-les-bases	Apprenez les fondamentaux de Python : syntaxe, variables, boucles et fonctions. Id+�al pour commencer.	/uploads/1767982466592-attestationscolarite.jpeg	0	PUBLISHED	cmk6rum5d0000mk93vhinqzg1	2026-01-09 11:27:57.151	2026-01-11 14:42:25.102	EUR


--
-- Data for Name: lesson_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_likes (id, user_id, lesson_id, created_at) FROM stdin;
cmjrw0ktd0000ds9348mf0e08	cmjrs54ed00091o93md54w5dj	cmjrsgrtj000d1o9367niqxwa	2025-12-30 01:07:15.937
cmjrw8no10000uw93icbeo4df	cmjrs54ed00091o93md54w5dj	cmjruy5hx0007yc93qhglvh5i	2025-12-30 01:13:32.88
cmjsj2ijb00004k939dqy17ke	cmjrs54ed00091o93md54w5dj	cmjrsgvx3000e1o9313w9qlb1	2025-12-30 11:52:37.461


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, description, video_url, "position", status, is_free, chapter_id, created_at, updated_at) FROM stdin;
cmk9tv8vy0001uo93s0ndygxh	Philosophie	\N	\N	1	DRAFT	f	cmk9tt0p80000uo93fiavw0qk	2026-01-11 14:26:59.134	2026-01-11 14:26:59.134
cmjruy5hx0007yc93qhglvh5i	rag	<ul><li><strong>scalability</strong></li><li>redondande</li><li>amour</li><li>passion</li></ul><p><u>love</u></p><p>f</p>	https://youtu.be/kISRpDfbS4Y?si=HlBG9kF4NtaTpyoF	3	PUBLISHED	f	cmjrux6190004yc93p78j8euu	2025-12-30 00:37:23.157	2025-12-30 01:10:57.594
cmjroe8ml00091093e8ov87rr	baba	\N	\N	1	DRAFT	f	cmjro1y150003109329gqpno8	2025-12-29 21:33:56.397	2025-12-29 22:01:19.961
cmjroe3bl00081093m5tdevxn	bobooo	\N	/uploads/1767044366179--visualselection7.png	2	DRAFT	f	cmjro1y150003109329gqpno8	2025-12-29 21:33:49.521	2025-12-29 22:01:19.975
cmjruy1so0006yc93vpzrbm58	dl	<p>//&nbsp;prisma.config.ts</p><p>import&nbsp;{&nbsp;defineConfig&nbsp;}&nbsp;from&nbsp;&quot;@prisma/config&quot;;</p><p></p><p>export&nbsp;default&nbsp;defineConfig({</p><p>&nbsp;&nbsp;earlyAdopter:&nbsp;true,&nbsp;//&nbsp;Recommand+�&nbsp;pour&nbsp;les&nbsp;fonctionnalit+�s&nbsp;r+�centes</p><p>&nbsp;&nbsp;datasource:&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;process.env.DATABASE_URL,</p><p>&nbsp;&nbsp;},</p><p>});</p>	/uploads/1767057785159-WIN20250913154811Pro.mp4	2	PUBLISHED	t	cmjrux6190004yc93p78j8euu	2025-12-30 00:37:18.36	2025-12-30 01:24:03.772
cmjrodxq300071093d12r5yxy	bibi	fo te chercher	/uploads/1767045824533-WIN20250913154811Pro.mp4	0	DRAFT	t	cmjro1y150003109329gqpno8	2025-12-29 21:33:42.267	2025-12-29 22:03:44.699
cmjrrqgiu00061o93jgs3y8wx	discrete	\N	\N	1	DRAFT	f	cmjrrns1d00031o93to7w0e3g	2025-12-29 23:07:25.35	2025-12-29 23:07:25.35
cmjrrql5200071o93rnwgmz5h	continu	\N	\N	2	DRAFT	f	cmjrrns1d00031o93to7w0e3g	2025-12-29 23:07:31.334	2025-12-29 23:07:31.334
cmjrsh3e2000f1o93czzxaf92	ssh	\N	\N	3	DRAFT	f	cmjrsg0gd000c1o93j0pwpa3d	2025-12-29 23:28:08.042	2025-12-29 23:28:08.042
cmjrsgrtj000d1o9367niqxwa	tcp	<p>blablabloblo</p>	/uploads/1767062303665-video.mp4	1	PUBLISHED	f	cmjrsg0gd000c1o93j0pwpa3d	2025-12-29 23:27:53.047	2025-12-30 02:38:24.003
cmjrupytn0001yc93dsji906b	notion de virus	<p>definition&nbsp;et&nbsp;acculturation;les&nbsp;must&nbsp;know</p><ol><li><strong>hv</strong></li><li>gc</li><li>gc</li></ol>	/uploads/1767054751030-WIN20250913154811Pro.mp4	1	PUBLISHED	t	cmjruomhk0000yc93ovaebgw0	2025-12-30 00:31:01.259	2025-12-30 11:55:06.423
cmjrsgvx3000e1o9313w9qlb1	http	<p>le&nbsp;big&nbsp;,le&nbsp;boss,bzf&nbsp;bif</p>	/uploads/1767051198951-WIN20250913154811Pro.mp4	2	PUBLISHED	t	cmjrsg0gd000c1o93j0pwpa3d	2025-12-29 23:27:58.359	2025-12-29 23:33:26.017
cmjruq7y90002yc93a2o2ha1d	remote ransomware	\N	\N	2	DRAFT	f	cmjruomhk0000yc93ovaebgw0	2025-12-30 00:31:13.089	2025-12-30 00:31:13.089
cmjruqeei0003yc93167jwqky	notion de go	<p>langage&nbsp;de&nbsp;programmation,pas&nbsp;oblige,mais&nbsp;c&nbsp;est&nbsp;utile&nbsp;de&nbsp;connaitre</p>	/uploads/1767054775389-WIN20250913154811Pro.mp4	3	PUBLISHED	f	cmjruomhk0000yc93ovaebgw0	2025-12-30 00:31:21.45	2025-12-30 00:33:37.4
cmjruxw4a0005yc93vgfmz7r2	ml	\N	\N	1	DRAFT	f	cmjrux6190004yc93p78j8euu	2025-12-30 00:37:11.002	2025-12-30 00:37:11.002
cmk9tvt0o0002uo93cttl5rha	Philosophie	<p><strong>1.&nbsp;La&nbsp;Gen+�se&nbsp;</strong></p><p>&nbsp;Qui&nbsp;a&nbsp;cr+�+�&nbsp;ce&nbsp;<u>monstre</u>&nbsp;de&nbsp;<em>simplicit+�</em>&nbsp;?&nbsp;Tout&nbsp;commence&nbsp;en&nbsp;1989.&nbsp;Alors&nbsp;que&nbsp;le&nbsp;monde&nbsp;f+�te&nbsp;No+�l,&nbsp;un&nbsp;informaticien&nbsp;n+�erlandais&nbsp;nomm+�&nbsp;Guido&nbsp;van&nbsp;Rossum&nbsp;s&#39;ennuie.&nbsp;Il&nbsp;d+�cide&nbsp;de&nbsp;cr+�er&nbsp;un&nbsp;nouveau&nbsp;langage&nbsp;de&nbsp;programmation&nbsp;dans&nbsp;son&nbsp;garage.&nbsp;&nbsp;Le&nbsp;Cr+�ateur&nbsp;:&nbsp;Guido&nbsp;van&nbsp;Rossum&nbsp;(surnomm+�&nbsp;longtemps&nbsp;le&nbsp;&quot;Dictateur&nbsp;Bienveillant&nbsp;+�&nbsp;Vie&quot;).&nbsp;&nbsp;Le&nbsp;Nom&nbsp;:&nbsp;Non,&nbsp;+�a&nbsp;ne&nbsp;vient&nbsp;pas&nbsp;du&nbsp;serpent&nbsp;!&nbsp;Guido&nbsp;+�tait&nbsp;un&nbsp;fan&nbsp;absolu&nbsp;de&nbsp;la&nbsp;troupe&nbsp;d&#39;humour&nbsp;britannique&nbsp;Monty&nbsp;Python���s&nbsp;Flying&nbsp;Circus.&nbsp;Il&nbsp;voulait&nbsp;un&nbsp;nom&nbsp;court,&nbsp;unique&nbsp;et&nbsp;un&nbsp;peu&nbsp;myst+�rieux.&nbsp;&nbsp;L&#39;Objectif&nbsp;:&nbsp;Cr+�er&nbsp;un&nbsp;langage&nbsp;aussi&nbsp;lisible&nbsp;que&nbsp;l&#39;anglais,&nbsp;pour&nbsp;que&nbsp;m+�me&nbsp;un&nbsp;d+�butant&nbsp;puisse&nbsp;comprendre&nbsp;ce&nbsp;qu&#39;il&nbsp;se&nbsp;passe&nbsp;en&nbsp;regardant&nbsp;l&#39;+�cran.</p><p>&nbsp;&nbsp;<strong>2.&nbsp;La&nbsp;Philosophie&nbsp;</strong></p><p>&nbsp;&quot;Zen&nbsp;of&nbsp;Python&quot;&nbsp;Python&nbsp;n&#39;est&nbsp;pas&nbsp;juste&nbsp;un&nbsp;outil,&nbsp;c&#39;est&nbsp;un&nbsp;+�tat&nbsp;d&#39;esprit.&nbsp;On&nbsp;suit&nbsp;des&nbsp;r+�gles&nbsp;simples&nbsp;:&nbsp;&nbsp;La&nbsp;clart+�&nbsp;est&nbsp;plus&nbsp;importante&nbsp;que&nbsp;la&nbsp;complexit+�.&nbsp;&nbsp;Il&nbsp;ne&nbsp;devrait&nbsp;y&nbsp;avoir&nbsp;qu&#39;une&nbsp;seule&nbsp;fa+�on&nbsp;+�vidente&nbsp;de&nbsp;faire&nbsp;les&nbsp;choses.&nbsp;&nbsp;Si&nbsp;le&nbsp;code&nbsp;est&nbsp;dur&nbsp;+�&nbsp;expliquer,&nbsp;c&#39;est&nbsp;une&nbsp;mauvaise&nbsp;id+�e.</p><p><strong>&nbsp;3.&nbsp;Pourquoi&nbsp;Python&nbsp;est&nbsp;le&nbsp;roi&nbsp;en&nbsp;2026</strong>?</p><p>&nbsp;Imagine&nbsp;un&nbsp;couteau&nbsp;suisse&nbsp;g+�ant.&nbsp;Python&nbsp;est&nbsp;partout&nbsp;:&nbsp;&nbsp;Intelligence&nbsp;Artificielle&nbsp;:&nbsp;C&#39;est&nbsp;lui&nbsp;qui&nbsp;fait&nbsp;r+�fl+�chir&nbsp;ChatGPT&nbsp;et&nbsp;tes&nbsp;futurs&nbsp;agents&nbsp;marketing.&nbsp;&nbsp;Science&nbsp;&amp;&nbsp;Agriculture&nbsp;:&nbsp;Il&nbsp;analyse&nbsp;tes&nbsp;capteurs&nbsp;dans&nbsp;AgriConnect.&nbsp;&nbsp;Web&nbsp;&amp;&nbsp;Gestion&nbsp;:&nbsp;Il&nbsp;g+�re&nbsp;les&nbsp;bases&nbsp;de&nbsp;donn+�es&nbsp;des&nbsp;+�tudiants&nbsp;de&nbsp;ton&nbsp;Agence&nbsp;Chine.&nbsp;&nbsp;Automatisation&nbsp;:&nbsp;Il&nbsp;peut&nbsp;trier&nbsp;tes&nbsp;fichiers,&nbsp;envoyer&nbsp;tes&nbsp;mails&nbsp;et&nbsp;r+�pondre&nbsp;+�&nbsp;tes&nbsp;clients&nbsp;pendant&nbsp;que&nbsp;tu&nbsp;dors.</p><p><strong>&nbsp;4.&nbsp;Le&nbsp;Concept&nbsp;des&nbsp;&quot;Batteries&nbsp;Incluses&quot;</strong></p><p>&nbsp;C&#39;est&nbsp;la&nbsp;grande&nbsp;force&nbsp;de&nbsp;Python.&nbsp;Quand&nbsp;tu&nbsp;installes&nbsp;Python,&nbsp;tu&nbsp;ne&nbsp;re+�ois&nbsp;pas&nbsp;juste&nbsp;un&nbsp;moteur&nbsp;vide.&nbsp;Tu&nbsp;re+�ois&nbsp;une&nbsp;tonne&nbsp;d&#39;outils&nbsp;d+�j+�&nbsp;pr+�ts&nbsp;(les&nbsp;biblioth+�ques)&nbsp;pour&nbsp;faire&nbsp;du&nbsp;web,&nbsp;des&nbsp;maths,&nbsp;ou&nbsp;du&nbsp;cloud&nbsp;avec&nbsp;LocalStack.&nbsp;&nbsp;Retiens&nbsp;bien&nbsp;ceci&nbsp;:&nbsp;Apprendre&nbsp;Python,&nbsp;ce&nbsp;n&#39;est&nbsp;pas&nbsp;apprendre&nbsp;par&nbsp;c+�ur.&nbsp;C&#39;est&nbsp;apprendre&nbsp;+�&nbsp;assembler&nbsp;les&nbsp;pi+�ces&nbsp;d&#39;un&nbsp;Lego&nbsp;infini.&nbsp;&nbsp;5.&nbsp;Ta&nbsp;Mission&nbsp;Dans&nbsp;ce&nbsp;cours,&nbsp;nous&nbsp;ne&nbsp;battrons&nbsp;pas&nbsp;des&nbsp;records&nbsp;de&nbsp;vitesse&nbsp;(le&nbsp;C++&nbsp;est&nbsp;plus&nbsp;rapide).&nbsp;Nous&nbsp;battrons&nbsp;des&nbsp;records&nbsp;de&nbsp;cr+�ativit+�.&nbsp;&nbsp;&quot;La&nbsp;programmation&nbsp;est&nbsp;un&nbsp;super-pouvoir.&nbsp;Python&nbsp;est&nbsp;la&nbsp;baguette&nbsp;magique&nbsp;la&nbsp;plus&nbsp;facile&nbsp;+�&nbsp;manier.&quot;&nbsp;</p>	/uploads/1768142353178-test.mp4	0	PUBLISHED	t	cmk6slazz0001ng93ynxeh8mu	2026-01-11 14:27:25.224	2026-01-11 14:39:13.509
cmk6slb0d0002ng93riggfc6f	Introduction Python & Installation - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/01_introduction_python.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	\N	1	PUBLISHED	t	cmk6slazz0001ng93ynxeh8mu	2026-01-09 11:27:57.181	2026-01-11 14:45:03.578
cmk6slb2c0008ng93n3p4ygew	Boucles (For, While) - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/04_boucles.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	\N	1	PUBLISHED	f	cmk6slb240007ng93pbl26ge8	2026-01-09 11:27:57.252	2026-01-11 14:48:01.434
cmk6slb2t000ang93xwjaka0i	Listes & Tuples - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/cours/python/basic/05_listes_tuples.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	\N	1	PUBLISHED	f	cmk6slb2l0009ng9381nab8dd	2026-01-09 11:27:57.269	2026-01-11 14:48:45.028
cmk6slb3b000cng936mcvva45	Dictionnaires - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/cours/python/basic/06_dictionnaires.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	\N	1	PUBLISHED	f	cmk6slb33000bng93nlp2whpt	2026-01-09 11:27:57.287	2026-01-11 14:49:34.807
cmk6slb1t0006ng93qiosyktj	Op+�rateurs & Conditions - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/03_operateurs_conditions.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	\N	1	PUBLISHED	f	cmk6slb1i0005ng93tztacdag	2026-01-09 11:27:57.233	2026-01-11 14:45:58.06
cmk6slb180004ng93xjm5ik1z	Bases & Syntaxe - Code Source	<p>**Acc+�der&nbsp;au&nbsp;code&nbsp;source&nbsp;du&nbsp;cours&nbsp;:**&nbsp;[����&nbsp;Voir&nbsp;le&nbsp;notebook&nbsp;sur&nbsp;GitHub](<a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/02_bases_syntaxe.ipynb" rel="noopener noreferrer" target="_blank">lien</a>)&nbsp;Ce&nbsp;notebook&nbsp;contient&nbsp;tout&nbsp;le&nbsp;code&nbsp;et&nbsp;les&nbsp;explications&nbsp;pour&nbsp;cette&nbsp;partie&nbsp;du&nbsp;cours.&nbsp;</p>	/uploads/1768146219140-vartest.mp4	1	PUBLISHED	f	cmk6slb0q0003ng93yith1z82	2026-01-09 11:27:57.212	2026-01-11 15:43:39.394
cmk6slb3v000eng934eux7n2c	Fonctions - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/basic/07_fonctions.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb3m000dng931rgaa96b	2026-01-09 11:27:57.307	2026-01-09 11:27:57.307
cmk6slb4g000gng93l4hsu7t7	Modules & Gestion des Erreurs - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/basic/08_modules_erreurs.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb44000fng933lolmbye	2026-01-09 11:27:57.328	2026-01-09 11:27:57.328
cmk6slb5i000jng93bewymg6t	Gestion de Fichiers - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/01_gestion_fichiers.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	t	cmk6slb5a000ing932evf8tmo	2026-01-09 11:27:57.366	2026-01-09 11:34:32.14
cmk6slb6l000lng93u6lk8dwy	Compr+�hensions de Listes - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/02_comprehensions_listes.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb5t000kng93sgfbekhq	2026-01-09 11:27:57.405	2026-01-09 11:27:57.405
cmk6slb7q000nng93wcsqvxzm	POO - Classes et Objets - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/03_poo_classes.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb6x000mng93jlnyiu7k	2026-01-09 11:27:57.446	2026-01-09 11:27:57.446
cmk6slb8f000png933sgfbd0f	POO - H+�ritage et Polymorphisme - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/04_poo_heritage.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb82000ong93jql2zu8x	2026-01-09 11:27:57.471	2026-01-09 11:27:57.471
cmk6slb99000rng93xl4rsmi4	Fonctions Avanc+�es (Lambda, Decorateurs) - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/05_fonctions_avancees.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb8t000qng935dm09mb2	2026-01-09 11:27:57.501	2026-01-09 11:27:57.501
cmk6slbad000tng9389igt1tk	D+�corateurs - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/06_decorateurs.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slb9w000sng9360yi3c4m	2026-01-09 11:27:57.541	2026-01-09 11:27:57.541
cmk6slbbe000vng93bqpzqppc	It+�rateurs & G+�n+�rateurs - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/07_iterateurs_generateurs.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbay000ung93evqrvke8	2026-01-09 11:27:57.578	2026-01-09 11:27:57.578
cmk6slbcb000xng931avoghfj	S+�rialisation (JSON, CSV) - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/08_serialisation_json_csv.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbc1000wng93u50bx9pq	2026-01-09 11:27:57.611	2026-01-09 11:27:57.611
cmk6slbcv000zng93p1by39bk	Dates & Heures - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/09_dates_heures.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbcl000yng93qq0qgq6g	2026-01-09 11:27:57.631	2026-01-09 11:27:57.631
cmk6slbdc0011ng93t6ij3i2e	R+�cursivit+� - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/10_recursivite.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbd30010ng93stzpvm03	2026-01-09 11:27:57.648	2026-01-09 11:27:57.648
cmk6slbe00014ng93ik6me4n6	Requ+�tes API - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/01_requetes_api.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbds0013ng93cltl3bol	2026-01-09 11:27:57.672	2026-01-09 11:27:57.672
cmk6slbek0016ng93s84x9ke0	Expressions R+�guli+�res (Regex) - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/02_regex.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbeb0015ng93anq2jpct	2026-01-09 11:27:57.692	2026-01-09 11:27:57.692
cmk6slbgf0018ng93h6ar5g8z	Bases de Donn+�es (SQLite) - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/03_bases_de_donnees_sqlite.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbfe0017ng93wat8tzmm	2026-01-09 11:27:57.759	2026-01-09 11:27:57.759
cmk6slbhj001ang934z7psslc	Intro Data Science (Pandas) - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/04_intro_datascience_pandas.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbgs0019ng93kueuz43m	2026-01-09 11:27:57.799	2026-01-09 11:27:57.799
cmk6slbik001cng93c21qbl29	Tests Unitaires - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/05_tests_unitaires.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbhv001bng93ey42j37j	2026-01-09 11:27:57.836	2026-01-09 11:27:57.836
cmk6slbj7001eng93r4woara5	Programmation Asynchrone - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/06_asynchrone.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbiv001dng933t1pnetw	2026-01-09 11:27:57.859	2026-01-09 11:27:57.859
cmk6slbka001gng934cje412i	Gestionnaires de Contexte & Typage - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/advance/07_gestionnaires_contexte_et_typage.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbjh001fng93xkj2hfmv	2026-01-09 11:27:57.897	2026-01-09 11:27:57.897
cmk6slbky001jng93qvxbl44p	Bases et Lecture - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/pandas/cours/01_bases_et_lecture.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbkr001ing93pmi7r6wa	2026-01-09 11:27:57.922	2026-01-09 11:27:57.922
cmk6slble001lng932ja8p34w	Manipulation & Filtrage - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/pandas/cours/02_manipulation_filtrage.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbl6001kng938a61ghke	2026-01-09 11:27:57.938	2026-01-09 11:27:57.938
cmk6slbm4001nng9384h3gasu	GroupBy & Analyse - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/pandas/cours/03_groupby_analyse.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbln001mng93ra7l2ge4	2026-01-09 11:27:57.964	2026-01-09 11:27:57.964
cmk6slbmj001png93xonv4lte	Fusion & Temporel - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/pandas/cours/04_fusion_temporel.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbmb001ong93c3s8k9gj	2026-01-09 11:27:57.979	2026-01-09 11:27:57.979
cmk6slbn7001sng93w7gkwtng	Bases NumPy - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/numpy/cours/01_bases_numpy.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbn0001rng93qx7zfb52	2026-01-09 11:27:58.003	2026-01-09 11:27:58.003
cmk6slbnn001ung93syzncgwl	Op+�ration Broadcasting - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/numpy/cours/02_operation_broadcasting.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbnf001tng937lcaryjc	2026-01-09 11:27:58.018	2026-01-09 11:27:58.018
cmk6slbo1001wng93vtqsx4to	Indexing Slicing Avanc+� - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/numpy/cours/03_indexing_slicing_avance.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbnu001vng93syrfbqq5	2026-01-09 11:27:58.033	2026-01-09 11:27:58.033
cmk6slbos001zng93y09xf26j	Matplotlib Bases - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/visualization/cours/01_matplotlib_bases.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbok001yng93ziq76vew	2026-01-09 11:27:58.06	2026-01-09 11:27:58.06
cmk6slbpa0021ng93ct0j6e9g	Types Graphiques - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/visualization/cours/02_types_graphiques.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbp10020ng93tsie1vaz	2026-01-09 11:27:58.078	2026-01-09 11:27:58.078
cmk6slbps0023ng934i5peh3u	Subplots - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/visualization/cours/03_subplots.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbpj0022ng935b4t9amk	2026-01-09 11:27:58.096	2026-01-09 11:27:58.096
cmk6slbqc0025ng930se8kdkq	Seaborn - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/visualization/cours/04_seaborn.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbq00024ng93brp20mal	2026-01-09 11:27:58.116	2026-01-09 11:27:58.116
cmk6slbr20028ng93sqeefvgp	Concepts IA - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/machine_learning/cours/01_concepts_ia.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbqu0027ng932uytmdel	2026-01-09 11:27:58.142	2026-01-09 11:27:58.142
cmk6slbrk002ang93iqgro03p	R+�gression Lin+�aire - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/machine_learning/cours/02_regression_lineaire.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbra0029ng93ym61j3hb	2026-01-09 11:27:58.16	2026-01-09 11:27:58.16
cmk6slbs2002cng93pvjlalyj	Classification KNN - Code Source	\n**Acc+�der au code source du cours :**\n\n[���� Voir le notebook sur GitHub](https://github.com/IDOEFRAIM/formations/blob/master/python/machine_learning/cours/03_classification_knn.ipynb)\n\nCe notebook contient tout le code et les explications pour cette partie du cours.\n          	\N	1	PUBLISHED	f	cmk6slbrs002bng93qw5xcr8j	2026-01-09 11:27:58.178	2026-01-09 11:27:58.178
cmk76oovc00030w937d0c6z7k	Introduction +� Python	\n                    <h3>Introduction</h3>\n                    <p>Python est un langage de programmation interpr+�t+�, interactif et orient+� objet. Il est facile +� apprendre et puissant.</p>\n                    <p>Dans cette le+�on, nous allons voir comment installer Python et configurer votre environnement.</p>\n                    <h4>Exemple de code :</h4>\n                    <pre class="ql-syntax" spellcheck="false">print("Hello World")</pre>\n                    <p><br></p>\n                    <p><strong>Ressources :</strong></p>\n                    <p>T+�l+�chargez le fichier source de cette le+�on ici : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/01_introduction_python.ipynb" target="_blank" rel="noopener noreferrer">01_introduction_python.ipynb</a></p>\n                  	\N	1	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00040w93w8gyf7iq	Bases & Syntaxe	\n                    <h3>Syntaxe de Base</h3>\n                    <p>Variables et types.</p>\n                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/02_bases_syntaxe.ipynb" target="_blank">02_bases_syntaxe.ipynb</a></p>\n                  	\N	2	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00050w937zy2jz79	Op+�rateurs & Conditions	<p>if, else, elif</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/03_operateurs_conditions.ipynb'>03_operateurs_conditions.ipynb</a></p>	\N	3	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00060w93udetc6a3	Boucles	<p>for, while</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/04_boucles.ipynb'>04_boucles.ipynb</a></p>	\N	4	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00070w93gnvbx0pz	Listes & Tuples	<p>Structures de donn+�es de base.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/05_listes_tuples.ipynb'>05_listes_tuples.ipynb</a></p>	\N	5	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00080w93wr26utcy	Dictionnaires	<p>Cl+�s et valeurs.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/06_dictionnaires.ipynb'>06_dictionnaires.ipynb</a></p>	\N	6	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovc00090w930a0so7tq	Fonctions	<p>D+�couper son code.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/07_fonctions.ipynb'>07_fonctions.ipynb</a></p>	\N	7	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oovd000a0w93w83o3310	Modules & Erreurs	<p>Imports et gestion des exceptions (try/except).</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/08_modules_erreurs.ipynb'>08_modules_erreurs.ipynb</a></p>	\N	8	PUBLISHED	f	cmk76ooug00020w935cghmiid	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooww000c0w93j2qqqm3w	Gestion de Fichiers	\n                    <h3>Lire et +�crire des fichiers texte</h3>\n                    <p>Apprenez +� manipuler des fichiers externes avec Python.</p>\n                    <pre class="ql-syntax" spellcheck="false">with open("fichier.txt", "r") as f:\n    contenu = f.read()</pre>\n                    <p><br></p>\n                    <p><strong>Ressources :</strong></p>\n                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/01_gestion_fichiers.ipynb" target="_blank">01_gestion_fichiers.ipynb</a></p>\n                  	\N	1	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooww000d0w936ao9pxu8	Compr+�hensions de Listes	<p>+�crire du code concis et puissant pour cr+�er des listes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/02_comprehensions_listes.ipynb'>02_comprehensions_listes.ipynb</a></p>	\N	2	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000e0w93lvwmrs1g	POO : Classes	<p>Programmation Orient+�e Objet : Les bases des Classes et Objets.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/03_poo_classes.ipynb'>03_poo_classes.ipynb</a></p>	\N	3	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000f0w93r7dkv277	POO : H+�ritage	<p>H+�ritage et Polymorphisme pour structurer des programmes complexes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/04_poo_heritage.ipynb'>04_poo_heritage.ipynb</a></p>	\N	4	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000g0w93jzxke6od	Fonctions Avanc+�es	<p>Fonctions lambda, *args et **kwargs.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/05_fonctions_avancees.ipynb'>05_fonctions_avancees.ipynb</a></p>	\N	5	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000h0w935lzke7kc	D+�corateurs	<p>Modifier le comportement des fonctions sans les changer.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/06_decorateurs.ipynb'>06_decorateurs.ipynb</a></p>	\N	6	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000i0w938bdmpteu	It+�rateurs & G+�n+�rateurs	<p>Utilisation de yield pour une it+�ration efficace.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/07_iterateurs_generateurs.ipynb'>07_iterateurs_generateurs.ipynb</a></p>	\N	7	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000j0w93sblunr48	S+�rialisation (JSON/CSV)	<p>Travailler avec des formats de donn+�es standards.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/08_serialisation_json_csv.ipynb'>08_serialisation_json_csv.ipynb</a></p>	\N	8	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000k0w93pufdq7c6	Dates & Heures	<p>Ma+�triser le module datetime.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/09_dates_heures.ipynb'>09_dates_heures.ipynb</a></p>	\N	9	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76oowx000l0w93ls1aqsyg	R+�cursivit+�	<p>Comprendre les fonctions qui s'appellent elles-m+�mes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/10_recursivite.ipynb'>10_recursivite.ipynb</a></p>	\N	10	PUBLISHED	f	cmk76oowd000b0w938eaa4j9n	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000n0w93o1s1m21d	Requ+�tes API	\n                    <h3>Interagir avec le Web</h3>\n                    <p>Utiliser la biblioth+�que requests pour consommer des API.</p>\n                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/advance/01_requetes_api.ipynb" target="_blank">01_requetes_api.ipynb</a></p>\n                  	\N	1	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000o0w93png9bezv	Expressions R+�guli+�res (Regex)	<p>Manipuler du texte de fa+�on avanc+�e.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/02_regex.ipynb'>02_regex.ipynb</a></p>	\N	2	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000p0w93ov6fnm4m	Bases de donn+�es (SQLite)	<p>SQL et persistance de donn+�es avec SQLite.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/03_bases_de_donnees_sqlite.ipynb'>03_bases_de_donnees_sqlite.ipynb</a></p>	\N	3	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000q0w93gy9rtnrc	Intro Data Science (Pandas)	<p>Introduction +� l'analyse de donn+�es avec Pandas.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/04_intro_datascience_pandas.ipynb'>04_intro_datascience_pandas.ipynb</a></p>	\N	4	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000r0w93a2i3xumd	Tests Unitaires	<p>Fiabiliser son code avec unittest.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/05_tests_unitaires.ipynb'>05_tests_unitaires.ipynb</a></p>	\N	5	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000s0w93kvwttsxc	Programmation Asynchrone	<p>Gagner en performance avec asyncio.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/06_asynchrone.ipynb'>06_asynchrone.ipynb</a></p>	\N	6	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxf000t0w93izgthsb4	Context Managers & Typage	<p>Utiliser with et le Type Hinting pour un code robuste.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/07_gestionnaires_contexte_et_typage.ipynb'>07_gestionnaires_contexte_et_typage.ipynb</a></p>	\N	7	PUBLISHED	f	cmk76oox4000m0w938ppxfd19	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxo000v0w93mbblqtdz	TP : Gestion d'un Maquis	<p>Mini-projet de gestion de commande.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_gestion_maquis.ipynb'>tp_gestion_maquis.ipynb</a></p>	\N	1	PUBLISHED	f	cmk76ooxl000u0w93wi8bwvfv	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxo000w0w930oz95wdb	TP : Menu USSD	<p>Simulation d'un menu t+�l+�phonique.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_menu_ussd.ipynb'>tp_menu_ussd.ipynb</a></p>	\N	2	PUBLISHED	f	cmk76ooxl000u0w93wi8bwvfv	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606
cmk76ooxo000x0w93ku5bn5zu	TP : Tontine Communautaire	<p>Gestion d'+�pargne communautaire.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_tontine_communautaire.ipynb'>tp_tontine_communautaire.ipynb</a></p>	\N	3	PUBLISHED	f	cmk76ooxl000u0w93wi8bwvfv	2026-01-09 18:02:29.606	2026-01-09 18:02:29.606


--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.options (id, text, is_correct, question_id, created_at, updated_at) FROM stdin;
cmjryd1ca00047093r6f0ksme	caillou	f	cmjrycojr0002709396wh7q32	2025-12-30 02:12:56.458	2025-12-30 02:12:56.458
cmjrydgob00067093adipamde	DIEU	t	cmjrycojr0002709396wh7q32	2025-12-30 02:13:16.331	2025-12-30 02:13:16.331
cmjrydmh100077093sodj96fj	la pierre	f	cmjrycojr0002709396wh7q32	2025-12-30 02:13:23.845	2025-12-30 02:13:23.845
cmjryf8fb00087093cxbmo3dk	oui	t	cmjrycojt00037093aigu0276	2025-12-30 02:14:38.951	2025-12-30 02:14:38.951
cmjryfgq1000970933dpcwxrn	non	t	cmjrycojt00037093aigu0276	2025-12-30 02:14:49.705	2025-12-30 02:14:49.705
cmjryfok0000a7093sl4wmgk6	peut etre	f	cmjrycojt00037093aigu0276	2025-12-30 02:14:59.856	2025-12-30 02:14:59.856
cmjryg7eg000b7093zn6f0o79	a t on avis,tu m enerve	f	cmjrycojt00037093aigu0276	2025-12-30 02:15:24.28	2025-12-30 02:15:24.28
cmjsj77px00034k93ckyyh3z9	vrai	f	cmjsj6ues00024k93ft6kijmu	2025-12-30 11:56:16.725	2025-12-30 11:56:16.725
cmjsj7jbe00044k93wezpygz0	faux	t	cmjsj6ues00024k93ft6kijmu	2025-12-30 11:56:31.754	2025-12-30 11:56:31.754


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchases (id, user_id, course_id, created_at, updated_at, price) FROM stdin;
cmjrtae390000nc93z2kmew66	cmjrs54ed00091o93md54w5dj	cmjrsdq5r000b1o930l4s7z6h	2025-12-29 23:50:54.933	2025-12-29 23:50:54.933	\N
cmjrx35qo0002uw93r2owaw20	cmjrs54ed00091o93md54w5dj	cmjrrmnzf00021o93zlfharob	2025-12-30 01:37:15.984	2025-12-30 01:37:15.984	\N
cmk78dk5y0000zw93mq9a02k5	cmjrs54ed00091o93md54w5dj	cmk6slazk0000ng93gqpkw977	2026-01-09 18:49:49.654	2026-01-09 18:49:49.654	0
cmk7adrw80000sg931yoekp58	cmjrs54ed00091o93md54w5dj	cmk76oot900010w931hcjk05p	2026-01-09 19:45:58.903	2026-01-09 19:45:58.903	0


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, text, quiz_id, "position", created_at, updated_at) FROM stdin;
cmjrycojr0002709396wh7q32	qui a cree la terre	cmjrybpyq000070938rijtkt6	1	2025-12-30 02:12:39.878	2025-12-30 02:12:39.878
cmjrycojt00037093aigu0276	l ia reflechit	cmjrybpyq000070938rijtkt6	1	2025-12-30 02:12:39.881	2025-12-30 02:14:30.806
cmjsj6ues00024k93ft6kijmu	la vie est rose	cmjsj67ou00014k93iwoboqiv	1	2025-12-30 11:55:59.476	2025-12-30 11:55:59.476


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, title, lesson_id, created_at, updated_at) FROM stdin;
cmjrybpyq000070938rijtkt6	tcp quiz	cmjrsgrtj000d1o9367niqxwa	2025-12-30 02:11:55.057	2025-12-30 02:12:03.289
cmjsj67ou00014k93iwoboqiv	quizz sur la vie	cmjrupytn0001yc93dsji906b	2025-12-30 11:55:30.03	2025-12-30 11:56:42.517


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, course_id, rating, comment, created_at, updated_at) FROM stdin;
cmjrtb80m0002nc934ks4yh5z	cmjrs54ed00091o93md54w5dj	cmjrsdq5r000b1o930l4s7z6h	4	tres bon cours,franchement tu est bon....Continue comme ca,tu seras le meilleur	2025-12-29 23:51:33.718	2025-12-29 23:51:33.718


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (key, value, description, created_at, updated_at) FROM stdin;


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, lesson_id, is_completed, created_at, updated_at) FROM stdin;
cmjrti5df0005nc93d5wwq7w5	cmjrs54ed00091o93md54w5dj	cmjrsgrtj000d1o9367niqxwa	t	2025-12-29 23:56:56.883	2025-12-30 02:27:43.735
cmjrtaj5l0001nc93b6swclwl	cmjrs54ed00091o93md54w5dj	cmjrsgvx3000e1o9313w9qlb1	t	2025-12-29 23:51:01.497	2025-12-30 02:28:09.781


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, email_verified, image, role, created_at, updated_at, password, is_suspended, suspended_at, suspended_reason, suspended_until) FROM stdin;
cmjrnc4wc00011093elzww4a8	zouba	zouba@gmail.com	\N	\N	INSTRUCTOR	2025-12-29 21:04:18.632	2025-12-29 21:04:18.632	$2b$10$el7u1M1Kpxe6w5GRyZ9CAOfcwUP0CPcT23CySih/FpusPieVEmO6y	f	\N	\N	\N
cmjrsd9gk000a1o93ljyw1ubc	efra	efra@gmail.com	\N	\N	INSTRUCTOR	2025-12-29 23:25:09.284	2025-12-29 23:25:09.284	$2b$10$QzOnHallpGqN4L7e771nIuKCqmMcnxlyQOriJzx5qaHDr2s/BcKsm	f	\N	\N	\N
cmjrs54ed00091o93md54w5dj	beric	beric@gmail.com	\N	\N	STUDENT	2025-12-29 23:18:49.477	2025-12-29 23:42:52.253	$2b$10$kn6x.fDpdZPEyV/g8oHCt.7rMyKzAa8oe53KBFSGKXaEsDfZTyAp.	f	\N	\N	\N
cmjrwovdv0000rc932q8riune	ido	ido@admin.com	\N	\N	ADMIN	2025-12-30 01:26:09.379	2025-12-30 01:26:09.379	$2b$10$/EUHU5xllN/X1FCKfraA5eluR7Iq9.4LH1.ikVBS1w/Cdb4HAGUVG	f	\N	\N	\N
cmjrmrdno000010938lau3sx4	arsene tougma	oba@gmail.com	\N	\N	STUDENT	2025-12-29 20:48:10.211	2025-12-30 11:58:14.249	$2b$10$40lop3.J/TvEgcnB0iFDuuLPOvXoEx7PRxc.9QO6cH2TibjH/jKO6	t	2025-12-30 11:58:14.139	il m enerve	\N
cmkqohj8c0000kk93iw7hisfk	job	job@gmail.com	\N	\N	STUDENT	2026-01-23 09:28:26.268	2026-01-23 09:28:26.268	$2b$10$KFAzslYQSIiO3mh7YZueX.AOd1AqjLFYLxukKhMS9y0/Sw.FBtDZq	f	\N	\N	\N


--
-- Name: _AttachmentToLesson _AttachmentToLesson_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttachmentToLesson"
    ADD CONSTRAINT "_AttachmentToLesson_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);

-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments

--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: lesson_likes lesson_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_likes
    ADD CONSTRAINT lesson_likes_pkey PRIMARY KEY (id);

-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
--
ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions

--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
--
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.user_progress


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _AttachmentToLesson_B_index; Type: INDEX; Schema: public; Owner: postgres



--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);

--
--

CREATE INDEX attachments_course_id_idx ON public.attachments USING btree (course_id);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: postgres
--
CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);

--
-- Name: chapters_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX chapters_course_id_idx ON public.chapters USING btree (course_id);


-- Name: comments_lesson_id_idx; Type: INDEX; Schema: public; Owner: postgres

CREATE INDEX comments_lesson_id_idx ON public.comments USING btree (lesson_id);


--
-- Name: comments_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX comments_user_id_idx ON public.comments USING btree (user_id);

--
-- Name: courses_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_category_id_idx ON public.courses USING btree (category_id);


--
--
CREATE INDEX courses_instructor_id_idx ON public.courses USING btree (instructor_id);


--
-- Name: courses_slug_key; Type: INDEX; Schema: public; Owner: postgres
--
CREATE UNIQUE INDEX courses_slug_key ON public.courses USING btree (slug);

--
-- Name: lesson_likes_lesson_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lesson_likes_lesson_id_idx ON public.lesson_likes USING btree (lesson_id);

--
--

CREATE UNIQUE INDEX lesson_likes_user_id_lesson_id_key ON public.lesson_likes USING btree (user_id, lesson_id);


--
-- Name: lessons_chapter_id_idx; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX lessons_chapter_id_idx ON public.lessons USING btree (chapter_id);

--
-- Name: options_question_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX options_question_id_idx ON public.options USING btree (question_id);


--
-- Name: purchases_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchases_course_id_idx ON public.purchases USING btree (course_id);


-- Name: purchases_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX purchases_user_id_course_id_key ON public.purchases USING btree (user_id, course_id);


--
-- Name: questions_quiz_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX questions_quiz_id_idx ON public.questions USING btree (quiz_id);


--
-- Name: quizzes_lesson_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX quizzes_lesson_id_key ON public.quizzes USING btree (lesson_id);


--
-- Name: reviews_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_course_id_idx ON public.reviews USING btree (course_id);


--
-- Name: reviews_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reviews_user_id_course_id_key ON public.reviews USING btree (user_id, course_id);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: user_progress_lesson_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_progress_lesson_id_idx ON public.user_progress USING btree (lesson_id);


--
-- Name: user_progress_user_id_lesson_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_progress_user_id_lesson_id_key ON public.user_progress USING btree (user_id, lesson_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: _AttachmentToLesson _AttachmentToLesson_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttachmentToLesson"
    ADD CONSTRAINT "_AttachmentToLesson_A_fkey" FOREIGN KEY ("A") REFERENCES public.attachments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _AttachmentToLesson _AttachmentToLesson_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttachmentToLesson"
    ADD CONSTRAINT "_AttachmentToLesson_B_fkey" FOREIGN KEY ("B") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attachments attachments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chapters chapters_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: courses courses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: courses courses_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lesson_likes lesson_likes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_likes
    ADD CONSTRAINT lesson_likes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lesson_likes lesson_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_likes
    ADD CONSTRAINT lesson_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lessons lessons_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: options options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchases purchases_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchases purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


