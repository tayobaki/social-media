import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProfileEditor() {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const [image, setImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: posts } = useQuery({ queryKey: ["posts"] });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    },
    enabled: !!username,
  });

  const [editedData, setEditedData] = useState({
    username: authUser.username || "",
    headline: authUser.headline || "",
    location: authUser.location || "",
    about: authUser.about || "",
    profilePicture: authUser.profilePicture || "",
    bannerImg: authUser.bannerImg || "",
  });

  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      setBannerPreview(null);
      setProfilePreview(null);
      setDialogOpen(false);
      setLoading(false);
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(false);
    try {
      setLoading(true);
      const postData = { ...editedData };
      updateProfileMutation(postData);
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const name = e.target.name;
        if (name === "bannerImg") {
          setEditedData((prev) => ({ ...prev, bannerImg: reader.result }));
          setBannerPreview(reader.result);
        } else if (name === "profilePicture") {
          setEditedData((prev) => ({ ...prev, profilePicture: reader.result }));
          setProfilePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  if (isUserProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-blue-500 duration-700"
        />
      </div>
    );
  }

  const isOwnProfile = authUser.username === userProfile.username;

  // console.log({ posts, userProfile, authUser });

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-7 border-b border-white/20 p-4">
        <ArrowLeft
          size={30}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="flex flex-col text-xl">
          <p className="font-medium">{userProfile?.username}</p>
          <span>{(isOwnProfile && posts?.length) || 0} posts</span>
        </div>
      </div>
      <img
        src={userProfile?.bannerImg || "/banner.jpg"}
        alt="Banner"
        className="h-56 w-full object-cover"
      />
      <div className="px-4">
        <div className="flex -translate-y-1/2 items-end justify-between">
          <img
            src={userProfile?.profilePicture || "/avatar.png"}
            alt={userProfile?.username}
            className="size-32 rounded-full object-cover"
          />
          {authUser?.username === username && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <div className="flex h-10 w-28 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-white/30 font-semibold">
                  Edit Profile
                </div>
              </DialogTrigger>
              <DialogContent className="">
                <ScrollArea className="h-full w-full">
                  <DialogHeader className={"p-6"}>
                    <div className="flex w-full items-start justify-between">
                      <DialogTitle className="text-3xl leading-[40px]">
                        Edit Profile
                      </DialogTitle>
                      <div
                        onClick={handleSave}
                        className="flex h-10 w-28 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-white/30 bg-white font-semibold text-black"
                      >
                        <span>Save</span>
                        {loading && (
                          <Loader2
                            size={20}
                            className="animate-spin text-blue-500 duration-1000"
                          />
                        )}
                      </div>
                    </div>
                    <DialogDescription className="pt-6">
                      <div className="relative -mx-6">
                        <img
                          src={
                            bannerPreview ||
                            userProfile?.bannerImg ||
                            "/banner.jpg"
                          }
                          alt="Banner"
                          className="h-48 w-full object-cover"
                        />
                        <label
                          htmlFor="banner-image-upload"
                          className="cursor-pointer"
                        >
                          <ImagePlus
                            size={25}
                            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-white"
                          />
                          <input
                            id="banner-image-upload"
                            name="bannerImg"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="relative w-fit -translate-y-1/2">
                        <img
                          src={
                            profilePreview ||
                            userProfile?.profilePicture ||
                            "/avatar.png"
                          }
                          alt={userProfile?.username}
                          className="size-24 rounded-full object-cover"
                        />
                        <label
                          htmlFor="profile-image-upload"
                          className="cursor-pointer"
                        >
                          <ImagePlus
                            size={25}
                            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-white"
                          />
                          <input
                            id="profile-image-upload"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2 rounded-lg border border-white/35 px-3 py-1">
                          <div className="text-sm font-semibold">Name</div>
                          <Input
                            name="username"
                            value={editedData.username}
                            onChange={handleInputChange}
                            className="border-none bg-transparent pl-0 text-lg outline-none"
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <div className="flex flex-col gap-2 rounded-lg border border-white/35 px-3 py-1">
                          <div className="text-sm font-semibold">Headline</div>
                          <Input
                            name="headline"
                            value={editedData.headline}
                            onChange={handleInputChange}
                            className="border-none bg-transparent pl-0 text-lg outline-none"
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <div className="flex flex-col gap-2 rounded-lg border border-white/35 px-3 py-1">
                          <div className="text-sm font-semibold">Location</div>
                          <Input
                            name="location"
                            value={editedData.location}
                            onChange={handleInputChange}
                            className="border-none bg-transparent pl-0 text-lg outline-none"
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <div className="flex flex-col gap-2 rounded-lg border border-white/35 px-3 py-1">
                          <div className="text-sm font-semibold">Bio</div>
                          <Input
                            name="about"
                            value={editedData.about}
                            onChange={handleInputChange}
                            className="border-none bg-transparent pl-0 text-lg outline-none"
                            spellCheck={false}
                          />
                        </div>
                        <div className="flex flex-col gap-2 rounded-lg border border-white/35 px-3 py-1">
                          <div className="text-sm font-semibold">Email</div>
                          <Input
                            name="email"
                            value={userProfile?.email}
                            className="pointer-events-none cursor-default border-none bg-transparent pl-0 text-lg outline-none"
                          />
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="-mt-9 text-wrap">
          <h1 className="text-3xl font-semibold">{userProfile?.username}</h1>
          <p>{userProfile?.headline}</p>
          <p>{userProfile?.about}</p>
          <p>{userProfile?.location}</p>
        </div>
      </div>
    </div>
  );
}
