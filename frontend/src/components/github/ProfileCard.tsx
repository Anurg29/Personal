import Image from "next/image";
import { Users, BookOpen, MapPin } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { GithubProfile } from "@/lib/types";

export function ProfileCard({ profile }: { profile: GithubProfile }) {
  return (
    <HUDCard className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-jarvis-cyan/30 shadow-glow-sm">
          <Image
            src={profile.avatar_url}
            alt={profile.name || profile.login}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-jarvis-surface" />
      </div>

      <div className="text-center sm:text-left flex-1">
        <h2 className="font-orbitron text-xl font-bold text-jarvis-text tracking-wide">
          {profile.name || profile.login}
        </h2>
        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-jarvis-cyan text-sm hover:underline"
        >
          @{profile.login}
        </a>
        {profile.bio && (
          <p className="text-jarvis-muted text-sm mt-2 max-w-md">{profile.bio}</p>
        )}

        <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Users size={14} className="text-jarvis-cyan" />
            <span className="text-jarvis-text font-medium">{profile.followers}</span>
            <span className="text-jarvis-muted">followers</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Users size={14} className="text-jarvis-muted" />
            <span className="text-jarvis-text font-medium">{profile.following}</span>
            <span className="text-jarvis-muted">following</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <BookOpen size={14} className="text-jarvis-cyan" />
            <span className="text-jarvis-text font-medium">{profile.public_repos}</span>
            <span className="text-jarvis-muted">repos</span>
          </div>
        </div>
      </div>
    </HUDCard>
  );
}
