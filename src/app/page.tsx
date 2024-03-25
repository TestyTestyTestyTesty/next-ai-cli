import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/day1">
        <p>day 1</p>
      </Link>
      <Link href="/day3">
        <p>day 3</p>
      </Link>
      <Link href="/day4">
        <p>day 4</p>
      </Link>
    </>
  );
}
