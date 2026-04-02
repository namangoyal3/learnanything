import { prisma } from "../src/lib/prisma";

async function main() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { title: true, slug: true }
  });
  
  for (const article of articles) {
    console.log(`- **${article.title}**: https://learnanything.pro/learn/pm/${article.slug}`);
  }
}

main().finally(() => process.exit(0));
