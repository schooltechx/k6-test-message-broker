-- CreateTable
CREATE TABLE "m" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "r" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "r_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "d" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "d_pkey" PRIMARY KEY ("id")
);
